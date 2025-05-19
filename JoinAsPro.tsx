import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { CheckCircle2 } from "lucide-react";
import { api, auth } from "@/lib/supabase";

// Google Maps Component
const MapWithRadius = ({ center, radius }) => {
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  
  useEffect(() => {
    // This is a placeholder for Google Maps integration
    // In a real implementation, you would:
    // 1. Load the Google Maps JavaScript API
    // 2. Initialize the map when the API is loaded
    // 3. Create a circle overlay with the specified radius
    
    // Mock implementation for UI demonstration
    if (mapRef.current) {
      const mapElement = mapRef.current;
      mapElement.innerHTML = '';
      
      const mapInfo = document.createElement('div');
      mapInfo.className = 'text-center p-4';
      mapInfo.innerHTML = `
        <p class="text-gray-700 font-medium mb-2">Service Radius Visualization</p>
        <p class="text-sm text-gray-600">
          This map would show a ${radius} mile radius around your service location.
        </p>
        <p class="text-xs text-gray-500 mt-4">
          Note: In the production version, this will use the Google Maps API to 
          display a real map with your selected radius.
        </p>
      `;
      
      mapElement.appendChild(mapInfo);
    }
  }, [center, radius]);
  
  return (
    <div 
      ref={mapRef} 
      className="h-full bg-gray-100 flex items-center justify-center"
    >
      <div className="text-center p-4">
        <p className="text-gray-600 mb-2">Google Maps will display here</p>
        <p className="text-sm text-gray-500">
          This will show a {radius} mile radius around your service location
        </p>
      </div>
    </div>
  );
};

const JoinAsPro = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    serviceArea: '',
    
    // Professional experience
    selectedServices: [],
    serviceDetails: {},
    customServices: [],
    yearsExperience: '',
    bio: '',
    travelFee: '',
    serviceRadius: 10,
    serviceLocation: '',
    
    // Certifications
    certifications: [],
    
    // Account
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const totalSteps = 4;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // First create the user account
      const authResult = await auth.signUpWithEmail(formData.email, formData.password);
      
      if (!authResult.user) {
        throw new Error('Failed to create user account');
      }
      
      // Create the professional profile in Supabase
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
      };
      
      const professionalData = {
        service_area: formData.serviceArea,
        service_radius: formData.serviceRadius,
        travel_fee: formData.travelFee ? parseFloat(formData.travelFee) : null,
        years_experience: formData.yearsExperience,
        bio: formData.bio,
        verified: false
      };
      
      // Create the professional profile
      const result = await api.createProfessionalProfile(profileData, professionalData);
      
      if (!result || !result.professional_id) {
        throw new Error('Failed to create professional profile');
      }
      
      // Add services for the professional
      const professionalId = result.professional_id;
      
      // Process selected predefined services
      const servicePromises = formData.selectedServices.map(async (serviceId) => {
        if (serviceId.startsWith('custom-')) return; // Skip custom services here
        
        const serviceDetail = formData.serviceDetails[serviceId];
        if (!serviceDetail) return;
        
        const serviceData = {
          professional_id: professionalId,
          name: services.find(s => s.id === serviceId)?.title || 'Unknown Service',
          price: parseFloat(serviceDetail.price),
          description: serviceDetail.description,
          is_custom: false
        };
        
        return api.addService(serviceData);
      });
      
      // Process custom services
      const customServicePromises = Object.keys(formData.serviceDetails)
        .filter(id => id.startsWith('custom-'))
        .map(async (serviceId) => {
          const serviceDetail = formData.serviceDetails[serviceId];
          if (!serviceDetail) return;
          
          const serviceData = {
            professional_id: professionalId,
            name: serviceDetail.name,
            price: parseFloat(serviceDetail.price),
            description: serviceDetail.description,
            is_custom: true
          };
          
          return api.addService(serviceData);
        });
      
      // Wait for all service creations to complete
      await Promise.all([...servicePromises, ...customServicePromises]);
      
      toast({
        title: "Application Submitted",
        description: "Your professional profile has been created successfully. Our team will review your application and contact you shortly.",
        variant: "default",
      });
      
      // Redirect to success page or login
      navigate('/join-success');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={nextStep} 
        />;
      case 2:
        return <ProfessionalExperienceStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={nextStep} 
          onBack={prevStep} 
        />;
      case 3:
        return <CertificationStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={nextStep} 
          onBack={prevStep} 
        />;
      case 4:
        return <AccountSetupStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onBack={prevStep}
          onSubmit={submitForm}
          isSubmitting={isSubmitting}
        />;
      default:
        return <BasicInfoStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={nextStep} 
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Join as a Beauty Professional</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Apply to join our network of certified mobile beauty professionals and grow your business.
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10
                    ${step < currentStep ? 'bg-brand-bronze text-white' 
                      : step === currentStep ? 'bg-white border-2 border-brand-bronze text-brand-bronze' 
                      : 'bg-white border-2 border-gray-300 text-gray-400'}`}
                  >
                    {step < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-medium">{step}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    step <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Experience'}
                    {step === 3 && 'Certifications'}
                    {step === 4 && 'Account Setup'}
                  </span>
                      </div>
                    ))}
                  </div>
                </div>
                
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Main Form Container */}
            <div className="lg:col-span-2 bg-gray-50 p-8 rounded-lg border border-brand-bronze/20">
              <h2 className="text-2xl font-bold text-black mb-6">
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Professional Experience'}
                {currentStep === 3 && 'Certification Upload'}
                {currentStep === 4 && 'Account Setup'}
              </h2>
              
              {renderStep()}
            </div>
            
            {/* Info Sidebar */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg border border-brand-bronze/20 sticky top-24">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Benefits of Joining</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-brand-bronze mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expand your client base with our platform's visibility</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-brand-bronze mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Set your own schedule and service area</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-brand-bronze mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Receive instant payouts after services are completed</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-brand-bronze mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verified badge increases trust and bookings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-brand-bronze mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Simple 10% commission structure - no hidden fees</span>
                  </li>
                </ul>
                
                <h3 className="text-xl font-medium text-gray-900 mt-8 mb-4">Onboarding Process</h3>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className={`rounded-full h-5 w-5 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 ${currentStep >= 1 ? 'bg-brand-bronze' : 'bg-gray-300'}`}>1</div>
                    <span className={currentStep >= 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>Basic information</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`rounded-full h-5 w-5 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 ${currentStep >= 2 ? 'bg-brand-bronze' : 'bg-gray-300'}`}>2</div>
                    <span className={currentStep >= 2 ? 'text-gray-900 font-medium' : 'text-gray-500'}>Professional experience & services</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`rounded-full h-5 w-5 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 ${currentStep >= 3 ? 'bg-brand-bronze' : 'bg-gray-300'}`}>3</div>
                    <span className={currentStep >= 3 ? 'text-gray-900 font-medium' : 'text-gray-500'}>Certification verification</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`rounded-full h-5 w-5 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 ${currentStep >= 4 ? 'bg-brand-bronze' : 'bg-gray-300'}`}>4</div>
                    <span className={currentStep >= 4 ? 'text-gray-900 font-medium' : 'text-gray-500'}>Create your account</span>
                  </li>
                </ol>
                
                <div className="mt-8 bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="text-brand-bronze font-medium mb-2">Have questions?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    We're here to help with your application process.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full border-brand-bronze text-brand-bronze hover:bg-brand-bronze/10">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep = ({ formData, updateFormData, onNext }) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  // Simulate checking username availability
  const checkUsernameAvailability = (value) => {
    if (!value.trim()) {
      setIsUsernameAvailable(null);
      return;
    }
    
    setIsCheckingUsername(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock check - in production this would be an API call
      const available = !['taken', 'admin', 'beauty', 'maslynn'].includes(value.toLowerCase());
      setIsUsernameAvailable(available);
      setIsCheckingUsername(false);
    }, 600);
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <div className="space-y-1">
        <p className="text-sm text-black mb-4">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-black">First Name*</Label>
          <Input
            id="first-name"
            required
            className="bg-white border-gray-300 text-black"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-black">Last Name*</Label>
          <Input
            id="last-name"
            required
            className="bg-white border-gray-300 text-black"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username" className="text-black">Username*</Label>
        <div className="relative">
          <Input
            id="username"
            required
            className={`bg-white border-gray-300 text-black ${
              isUsernameAvailable === true ? 'border-green-500 pr-10' : 
              isUsernameAvailable === false ? 'border-red-500 pr-10' : ''
            }`}
            value={formData.username}
            onChange={(e) => {
              updateFormData('username', e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
          />
          {isCheckingUsername && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-brand-bronze rounded-full border-t-transparent"></div>
            </div>
          )}
          {isUsernameAvailable === true && !isCheckingUsername && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {isUsernameAvailable === false && !isCheckingUsername && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-xs text-black mt-1">
          This will be your unique identifier on our platform and visible to clients
          {isUsernameAvailable === false && (
            <span className="text-red-500 ml-1">- This username is already taken</span>
          )}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-black">Email Address*</Label>
          <Input
            id="email"
            type="email"
            required
            className="bg-white border-gray-300 text-black"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-black">Phone Number*</Label>
          <Input
            id="phone"
            type="tel"
            required
            className="bg-white border-gray-300 text-black"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location" className="text-black">Service Area*</Label>
        <div className="space-y-3">
          <Input
            id="location"
            required
            placeholder="City, Country (e.g., Paris, France)"
            className="bg-white border-gray-300 text-black"
            value={formData.serviceArea}
            onChange={(e) => updateFormData('serviceArea', e.target.value)}
          />
          <div className="flex items-start">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 w-full">
              <p className="font-medium">International Service Areas</p>
              <p className="mt-1">
                You can enter any city and country worldwide. Our platform supports international professionals.
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-black mt-1">Enter the primary city or country where you'll provide services</p>
      </div>
      
      <div className="pt-6 flex justify-end">
        <Button 
          type="submit" 
          className="px-8 bg-brand-bronze hover:bg-brand-bronze/80 text-white"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

// Step 2: Professional Experience
const ProfessionalExperienceStep = ({ formData, updateFormData, onNext, onBack }) => {
  const [customServiceName, setCustomServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('all');
  
  const toggleService = (serviceId) => {
    const currentServices = [...formData.selectedServices];
    const exists = currentServices.includes(serviceId);
    
    if (exists) {
      // Remove the service
      updateFormData('selectedServices', currentServices.filter(id => id !== serviceId));
      
      // Remove service details
      const updatedDetails = {...formData.serviceDetails};
      delete updatedDetails[serviceId];
      updateFormData('serviceDetails', updatedDetails);
    } else {
      // Add the service
      updateFormData('selectedServices', [...currentServices, serviceId]);
      
      // Initialize service details
      if (!formData.serviceDetails[serviceId]) {
        updateFormData('serviceDetails', {
          ...formData.serviceDetails,
          [serviceId]: { price: '', description: '' }
        });
      }
    }
  };
  
  const updateServiceDetail = (serviceId, field, value) => {
    updateFormData('serviceDetails', {
      ...formData.serviceDetails,
      [serviceId]: {
        ...formData.serviceDetails[serviceId],
        [field]: value
      }
    });
  };
  
  const addCustomService = () => {
    if (!customServiceName.trim()) return;
    
    const customId = `custom-${Date.now()}`;
    
    // Add to selected services
    updateFormData('selectedServices', [...formData.selectedServices, customId]);
    
    // Initialize service details
    updateFormData('serviceDetails', {
      ...formData.serviceDetails,
      [customId]: { name: customServiceName, price: '', description: '' }
    });
    
    // Add to custom services list
    updateFormData('customServices', [...formData.customServices, {
      id: customId,
      name: customServiceName
    }]);
    
    // Reset the input
    setCustomServiceName('');
  };

  const serviceCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'auto', label: 'Automotive Services' },
    { value: 'pet', label: 'Pet Services' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'home', label: 'Home & Lifestyle' },
    { value: 'tech', label: 'Tech & Specialty' },
    { value: 'eco', label: 'Sustainability & Niche' },
    { value: 'creative', label: 'Creative & Retail' }
  ];
  
  // Filter services based on selected category
  const filteredServices = serviceCategory === 'all' 
    ? services 
    : services.filter(service => {
        if (serviceCategory === 'beauty' && service.id.includes('beauty')) return true;
        if (serviceCategory === 'auto' && service.id.includes('auto')) return true;
        if (serviceCategory === 'pet' && service.id.includes('pet')) return true;
        if (serviceCategory === 'food' && service.id.includes('food')) return true;
        if (serviceCategory === 'home' && service.id.includes('home')) return true;
        if (serviceCategory === 'tech' && service.id.includes('tech')) return true;
        if (serviceCategory === 'eco' && service.id.includes('eco')) return true;
        if (serviceCategory === 'creative' && (service.id.includes('art') || service.id.includes('retail'))) return true;
        return false;
      });
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-black">Professional Experience</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4 text-black">Select Your Services</h3>
          <p className="text-black mb-6">
            Míche Mobile connects clients with professionals across a wide range of service categories. 
            Select the services you offer, including mobile beauty, automotive, pet care, food & beverage, 
            home services, tech support, eco-friendly options, and creative services.
          </p>
          
          <div className="mb-6">
            <Label>Filter by Category</Label>
            <Select value={serviceCategory} onValueChange={setServiceCategory}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredServices.map(service => (
              <div 
                key={service.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.selectedServices.includes(service.id) 
                    ? 'bg-brand-bronze/10 border-brand-bronze' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleService(service.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 text-brand-bronze" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-black">{service.title}</h4>
                      <Checkbox 
                        checked={formData.selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                          if (checked !== formData.selectedServices.includes(service.id)) {
                            toggleService(service.id);
                          }
                        }}
                        className="ml-2"
                      />
                    </div>
                    <p className="text-sm text-black mt-1">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Custom Service */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-md font-medium mb-2 text-black">Don't see your service? Add a custom service</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Specify your service..."
              value={customServiceName}
              onChange={(e) => setCustomServiceName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addCustomService} disabled={!customServiceName.trim()}>
              Add
            </Button>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-black mb-2">
              We offer opportunities for professionals in various fields, from beauty services to auto detailing, 
              pet care, mobile catering, home services, tech support, and many more. No matter your specialty, 
              if it's a mobile service, add it here!
            </p>
            <p className="text-sm text-black">
              We welcome professionals providing mobile car detailing, handyman services, dog walkers, 
              massage therapists, mobile barbers, food truck operators, electronics repair technicians, 
              and many other specialties.
            </p>
          </div>
        </div>

        {/* Service Details for Selected Services */}
        {formData.selectedServices.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-black">Service Details</h3>
            <p className="text-black mb-6">
              Please provide pricing and a brief description for each of your selected services.
            </p>
            
            <div className="space-y-6">
              {formData.selectedServices.map(serviceId => {
                const isCustom = serviceId.startsWith('custom-');
                const serviceName = isCustom 
                  ? formData.serviceDetails[serviceId]?.name
                  : services.find(s => s.id === serviceId)?.title;
                
                return (
                  <div key={serviceId} className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium mb-4">{serviceName}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`${serviceId}-price`} className="text-black">Price ($)</Label>
                        <Input
                          id={`${serviceId}-price`}
                          type="number"
                          placeholder="0.00"
                          value={formData.serviceDetails[serviceId]?.price || ''}
                          onChange={(e) => updateServiceDetail(serviceId, 'price', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${serviceId}-description`} className="text-black">Description</Label>
                      <Textarea
                        id={`${serviceId}-description`}
                        placeholder="Describe your service, offerings, and any special details..."
                        value={formData.serviceDetails[serviceId]?.description || ''}
                        onChange={(e) => updateServiceDetail(serviceId, 'description', e.target.value)}
                        className="h-24"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Experience & Availability */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-black">Experience & Availability</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="yearsExperience" className="text-black">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                placeholder="0"
                value={formData.yearsExperience}
                onChange={(e) => updateFormData('yearsExperience', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="bio" className="text-black">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell potential clients about your background, skills, and what makes your service special..."
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                className="h-32"
              />
            </div>
            
            <div>
              <Label htmlFor="travelFee" className="text-black">Travel Fee (optional)</Label>
              <Input
                id="travelFee"
                type="number"
                placeholder="0.00"
                value={formData.travelFee}
                onChange={(e) => updateFormData('travelFee', e.target.value)}
              />
              <p className="text-sm text-black mt-1">
                You can add a fee for travel beyond your service radius.
              </p>
            </div>
            
            <div>
              <Label>Service Radius (miles)</Label>
              <div className="flex items-center">
                <Input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={formData.serviceRadius}
                  onChange={(e) => updateFormData('serviceRadius', parseInt(e.target.value))}
                  className="w-full mr-4"
                />
                <span className="text-gray-700 font-medium w-8">{formData.serviceRadius}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={formData.selectedServices.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

// Step 3: Certification Upload
const CertificationStep = ({ formData, updateFormData, onNext, onBack }) => {
  return (
    <form className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-black mb-4">
          To ensure quality service for our clients, we require verification of your professional certifications
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="certifications" className="text-black">Certification Upload*</Label>
        <div className="bg-white border border-dashed border-gray-300 rounded-md p-8 text-center">
          <p className="text-black mb-4">
            Upload your certifications and licenses (.pdf, .jpg, .png)
          </p>
          <Button variant="outline" className="border-brand-bronze text-brand-bronze hover:bg-brand-bronze/10">
            Select Files
          </Button>
          <p className="text-xs text-black mt-2">
            Max file size: 10MB. You can upload multiple files.
          </p>
        </div>
        <p className="text-xs text-black mt-3">
          Acceptable documents include: cosmetology license, esthetician license, specialized training certificates, etc.
        </p>
      </div>
      
      <div className="space-y-2 pt-4">
        <Label htmlFor="insurance" className="text-black">Liability Insurance (Optional)</Label>
        <div className="bg-white border border-dashed border-gray-300 rounded-md p-8 text-center">
          <p className="text-black mb-4">
            Upload proof of liability insurance if you have it
          </p>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
            Select File
          </Button>
        </div>
        <p className="text-xs text-black mt-1">
          While not required, having liability insurance gives clients extra peace of mind
        </p>
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="px-8 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="px-8 bg-brand-bronze hover:bg-brand-bronze/80 text-white"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

// Step 4: Account Setup
const AccountSetupStep = ({ formData, updateFormData, onBack, onSubmit, isSubmitting }) => {
  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithGoogle();
      // The redirect to Google happens here, so the user will leave this page
      // We'll handle the return in AuthCallback.tsx
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="space-y-1">
        <p className="text-sm text-black mb-4">
          Create your professional account to complete your application
        </p>
      </div>
      
      <div className="space-y-4">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full bg-white border-gray-300 text-black hover:bg-gray-100 flex items-center justify-center"
          onClick={handleGoogleSignIn}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Continue with Google
        </Button>

        <div className="relative flex items-center">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="px-3 text-sm text-black">or</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-black">Password*</Label>
        <Input
          id="password"
          type="password"
          required
          className="bg-white border-gray-300 text-black"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
        />
        <p className="text-xs text-black mt-1">
          Must be at least 8 characters with a mix of letters, numbers, and symbols
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-black">Confirm Password*</Label>
        <Input
          id="confirm-password"
          type="password"
          required
          className="bg-white border-gray-300 text-black"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
        )}
      </div>
      
      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="marketing" 
            className="text-brand-bronze border-gray-300"
            checked={formData.agreeMarketing}
            onCheckedChange={(checked) => updateFormData('agreeMarketing', checked)}
          />
          <label
            htmlFor="marketing"
            className="text-sm text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I'd like to receive marketing emails about tips, promotions, and platform updates
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            className="text-brand-bronze border-gray-300" 
            required
            checked={formData.agreeTerms}
            onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-brand-bronze hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-brand-bronze hover:underline">
              Privacy Policy
            </Link>*
          </label>
        </div>
      </div>
      
      <div className="bg-brand-bronze/10 border border-brand-bronze/20 p-4 rounded-md mt-4">
        <p className="text-sm text-black">
          <strong>Note:</strong> After submitting, our team will review your application and certifications. 
          This process typically takes 1-2 business days. You'll receive an email notification when your account is approved.
        </p>
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button 
          onClick={onBack} 
          type="button"
          variant="outline"
          className="px-8 border-gray-300 text-gray-700 hover:bg-gray-100"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="px-8 bg-brand-silver hover:bg-brand-silver/80 text-black"
          disabled={isSubmitting || formData.password !== formData.confirmPassword || !formData.agreeTerms}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </form>
  );
};

export default JoinAsPro;
