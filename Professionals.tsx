import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProCard from "@/components/ProCard";
import { professionals } from "@/data/professionals";
import { services } from "@/data/services";

const Professionals = () => {
  const [filteredPros, setFilteredPros] = useState(professionals);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("rating");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName) 
        : [...prev, serviceName]
    );
  };

  const applyFilters = () => {
    let results = professionals;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(pro => 
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by selected services
    if (selectedServices.length > 0) {
      results = results.filter(pro => 
        selectedServices.some(service => pro.services.includes(service))
      );
    }
    
    // Filter by verification status
    if (verifiedOnly) {
      results = results.filter(pro => pro.verified);
    }
    
    // Apply sorting
    if (sortOrder === "rating") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "name_asc") {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name_desc") {
      results = [...results].sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredPros(results);
  };

  // Apply filters when filter options change
  React.useEffect(() => {
    applyFilters();
  }, [selectedServices, verifiedOnly, sortOrder]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-6">
              Find Your Beauty Professional
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
              Browse our directory of certified beauty professionals and book your next appointment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            <div className="bg-white p-6 rounded-lg border border-brand-bronze/20">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Filters</h2>
              
              <form onSubmit={handleSearch} className="mb-6">
                <Input
                  type="text"
                  placeholder="Search by name or service"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2 bg-white border-gray-300 text-gray-900"
                />
                <Button type="submit" className="w-full bg-brand-bronze hover:bg-brand-bronze/80 text-white">
                  Search
                </Button>
              </form>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sort by</h3>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Services</h3>
                <div className="space-y-2">
                  {services.map(service => (
                    <div key={service.id} className="flex items-center">
                      <Checkbox 
                        id={`service-${service.id}`} 
                        checked={selectedServices.includes(service.title)}
                        onCheckedChange={() => handleServiceToggle(service.title)}
                        className="text-brand-bronze border-gray-300"
                      />
                      <label 
                        htmlFor={`service-${service.id}`} 
                        className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {service.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <Checkbox 
                    id="verified-only"
                    checked={verifiedOnly}
                    onCheckedChange={() => setVerifiedOnly(!verifiedOnly)}
                    className="text-brand-bronze border-gray-300"
                  />
                  <label 
                    htmlFor="verified-only" 
                    className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Verified professionals only
                  </label>
                </div>
              </div>
            </div>
            
            {/* Professional listings */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-900">
                  Showing {filteredPros.length} professional{filteredPros.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {filteredPros.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPros.map((pro) => (
                    <ProCard
                      key={pro.id}
                      id={pro.id}
                      name={pro.name}
                      services={pro.services}
                      rating={pro.rating}
                      image={pro.image}
                      verified={pro.verified}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-brand-bronze/20">
                  <p className="text-lg text-gray-600">
                    No professionals found matching your criteria.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-brand-bronze mt-2"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedServices([]);
                      setVerifiedOnly(false);
                      setSortOrder("rating");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Professionals;
