'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter,
  ShieldCheck,
  Calendar,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Practitioner, Service } from '@/lib/api/types';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const AVAILABILITY_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'next_week', label: 'Next Week' },
  { value: 'any', label: 'Any Time' },
];

export default function FindPractitioner() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('any');
  const [minRating, setMinRating] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch services for specialty filter
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);

        // Fetch practitioners
        await searchPractitioners();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchPractitioners = async () => {
    setLoading(true);
    try {
      let url = '/api/practitioners/search?';
      const params = new URLSearchParams();
      
      if (selectedState) params.append('state', selectedState);
      if (selectedSpecialty) params.append('serviceId', selectedSpecialty);
      
      const response = await fetch(`${url}${params.toString()}`);
      const data = await response.json();
      
      let results = data.practitioners || [];
      
      // Client-side filtering for demo
      if (verifiedOnly) {
        results = results.filter((p: Practitioner) => p.is_verified);
      }
      if (minRating) {
        results = results.filter((p: Practitioner) => p.rating >= parseFloat(minRating));
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter((p: Practitioner) => 
          p.full_name?.toLowerCase().includes(query) ||
          p.bio?.toLowerCase().includes(query) ||
          p.education?.toLowerCase().includes(query)
        );
      }
      
      setPractitioners(results);
    } catch (error) {
      console.error('Error searching practitioners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPractitioners();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedSpecialty('');
    setSelectedAvailability('any');
    setMinRating('');
    setVerifiedOnly(false);
  };

  const activeFiltersCount = [
    selectedState,
    selectedSpecialty,
    selectedAvailability !== 'any' ? selectedAvailability : '',
    minRating,
    verifiedOnly ? 'verified' : '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Find a Practitioner</h1>
        <p className="text-slate-500 mt-1">Search for verified healthcare professionals in your state</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="What do you need help with? (e.g., anxiety, back pain, skin condition)"
              className="pl-12 h-12 text-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            className="h-12 px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500">
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All states</SelectItem>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All specialties</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Availability</label>
                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Min Rating</label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                    <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                    <SelectItem value="3.5">3.5+ ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verified Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Options</label>
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked: boolean) => setVerifiedOnly(checked)}
                  />
                  <label htmlFor="verified" className="text-sm text-slate-600 cursor-pointer">
                    Verified only
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={searchPractitioners} className="bg-teal-600 hover:bg-teal-700">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">{practitioners.length}</span> practitioners found
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : practitioners.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">No practitioners found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {practitioners.map((practitioner) => (
              <Card key={practitioner.id} className="hover:shadow-lg transition-all duration-200 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-xl font-bold backdrop-blur-sm">
                        {practitioner.full_name?.split(' ').map(n => n[0]).join('') || 'DR'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate">{practitioner.full_name}</h3>
                          {practitioner.is_verified && (
                            <ShieldCheck className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-teal-100 text-sm truncate">{practitioner.education || 'Healthcare Professional'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-medium">{practitioner.rating?.toFixed(1) || '5.0'}</span>
                          <span className="text-teal-200 text-sm">({practitioner.total_reviews || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Location & Experience */}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {practitioner.license_state}
                      </div>
                      {practitioner.years_of_experience && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {practitioner.years_of_experience} yrs exp
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {practitioner.bio && (
                      <p className="text-sm text-slate-600 line-clamp-2">{practitioner.bio}</p>
                    )}

                    {/* Services */}
                    {practitioner.services && practitioner.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {practitioner.services.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                            {service.name}
                          </Badge>
                        ))}
                        {practitioner.services.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                            +{practitioner.services.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Next Available */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">Next available: Today</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/practitioner/${practitioner.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </Link>
                      <Link href={`/booking/${practitioner.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
