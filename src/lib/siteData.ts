import {
  Rocket,
  Film,
  ShieldCheck,
  Building2,
  Hammer,
  Plane,
  Camera,
  Boxes,
  Share2,
  FileText,
  Scale,
  AlertTriangle,
} from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Properties', to: '/properties' },
  { name: 'Our Projects', to: '/projects' },
  { name: 'Services', to: '/services' },
  { name: 'Portfolio', to: '/gallery' },
  { name: 'SecureBuy™', to: '/services#securebuy' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export const SERVICE_NAV = [
  { name: 'Launch Packages', to: '/services#launch-packages' },
  { name: 'Media Production', to: '/services#media-production' },
  { name: 'Developer Retainer', to: '/services#developer-retainer' },
  { name: 'Turnkey Building', to: '/services#turnkey-building' },
  { name: 'SecureBuy™', to: '/services#securebuy' },
];

export const STATS = [
  { value: '2019', label: 'Founded' },
  { value: '₹250Cr+', label: 'Property Value Marketed' },
  { value: '150+', label: 'Successful Launches' },
  { value: '25+', label: 'Team Members' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '45', label: 'Days Avg. Time to Sell' },
  { value: '1000+', label: 'Channel Partners' },
  { value: '500+', label: 'Properties Verified' },
];

export const SERVICE_CARDS = [
  {
    icon: Rocket,
    title: 'Property Launch Packages',
    description:
      'Strategic marketing campaigns that position your property for maximum impact and fastest sale.',
    href: '#launch-packages',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  },
  {
    icon: Film,
    title: 'Media Production Studio',
    description:
      'Cinematic films, drone shoots, architectural photography, and compelling social content.',
    href: '#media-production',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
  },
  {
    icon: ShieldCheck,
    title: 'SecureBuy™ Due Diligence',
    description:
      'Comprehensive legal and financial verification to ensure safe, secure property transactions.',
    href: '#securebuy',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
  },
  {
    icon: Building2,
    title: 'Developer Solutions',
    description:
      'End-to-end marketing partnerships, CRM integration, and sales acceleration for developers.',
    href: '#developer-retainer',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  },
  {
    icon: Hammer,
    title: 'Turnkey Home Building',
    description:
      'From land evaluation to final handover — Aayat Projects manages the entire construction journey as your single point of responsibility.',
    href: '#turnkey-building',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
];

export const LAUNCH_PACKAGES = [
  {
    name: 'Pilot Launch',
    price: '₹1.5 Lakhs',
    description: 'Perfect for testing the waters with strategic marketing',
    features: [
      'Professional photography (20 images)',
      '2-minute property video',
      'Social media content pack',
      '30-day ad campaign',
      'Lead management dashboard',
      'Performance report',
    ],
    highlight: false,
  },
  {
    name: 'Standard Launch',
    price: '₹3.5 Lakhs',
    description: 'Comprehensive marketing for maximum market impact',
    features: [
      'Cinematic property film',
      'Drone photography & video',
      '50+ professional images',
      'Virtual tour creation',
      '60-day multi-platform ads',
      'Premium listing placements',
      'WhatsApp lead automation',
      'Weekly performance calls',
    ],
    highlight: true,
  },
  {
    name: 'Exclusive Digital Mandate',
    price: '₹6 Lakhs',
    description: 'Full-service marketing with exclusive representation',
    features: [
      'Everything in Standard',
      'Exclusive mandate agreement',
      '3D walkthrough & CGI renders',
      'PR & media outreach',
      'Influencer collaborations',
      '90-day intensive campaign',
      'Dedicated account manager',
      'Priority lead routing',
    ],
    highlight: false,
  },
];

export const MEDIA_SERVICES = [
  {
    icon: Film,
    title: 'Cinematic Property Films',
    description:
      'Full-scale film production with professional crew, 4K cameras, and cinematic storytelling that captures the essence of your property.',
    features: ['4K/6K filming', 'Professional sound design', 'Color grading', '2-5 minute films'],
    starting: '₹1,50,000',
  },
  {
    icon: Plane,
    title: 'Drone Photography & Video',
    description:
      'Licensed drone operators capture stunning aerial perspectives that showcase your property\u2019s location and surroundings.',
    features: [
      'Aerial photography',
      'Cinematic drone video',
      '360° panoramas',
      'Location context shots',
    ],
    starting: '₹35,000',
  },
  {
    icon: Camera,
    title: 'Architectural Photography',
    description:
      'Professional photography that highlights architectural details, interiors, and the unique character of your property.',
    features: ['HDR photography', 'Interior & exterior', 'Twilight shoots', '50+ edited images'],
    starting: '₹45,000',
  },
  {
    icon: Boxes,
    title: 'CGI & 3D Renders',
    description:
      'Photorealistic 3D renders and virtual staging for pre-construction sales or renovation visualization.',
    features: [
      'Exterior renders',
      'Interior visualizations',
      'Virtual staging',
      'Floor plan rendering',
    ],
    starting: '₹75,000',
  },
  {
    icon: Share2,
    title: 'Social Media Content',
    description:
      'Optimized content packages for Instagram, YouTube, and Facebook that drive engagement and inquiries.',
    features: ['Reels & shorts', 'Stories content', 'Carousel posts', 'Caption copywriting'],
    starting: '₹25,000',
  },
];

export const MEDIA_PROCESS = [
  { step: '01', title: 'Brief', desc: 'We understand your vision, goals, and property details' },
  { step: '02', title: 'Plan', desc: 'Shot list, scheduling, and creative direction' },
  { step: '03', title: 'Shoot', desc: 'Professional production with our expert crew' },
  { step: '04', title: 'Deliver', desc: 'Edited content ready for marketing' },
];

export const PORTFOLIO_ITEMS = [
  {
    id: '1',
    title: 'Villa Serenity Launch',
    category: 'Property Launch',
    client: 'Private Client',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    results: 'Sold within 45 days at asking price',
  },
  {
    id: '2',
    title: 'Coastal Dreams Film',
    category: 'Cinematic Film',
    client: 'Coastal Developers',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    results: '2M+ views across platforms',
  },
  {
    id: '3',
    title: 'Anjuna Heights Project',
    category: 'Developer Project',
    client: 'Anjuna Realty',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    results: '80% sold in first month',
  },
  {
    id: '4',
    title: 'Luxury Villa Portfolio',
    category: 'Photography',
    client: 'Multiple Clients',
    thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    results: '500+ premium images',
  },
  {
    id: '5',
    title: 'Penthouse Azure Film',
    category: 'Cinematic Film',
    client: 'Private Client',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    results: '₹15Cr sale achieved',
  },
  {
    id: '6',
    title: 'Palm Residences Launch',
    category: 'Property Launch',
    client: 'Palm Developers',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    results: 'All units sold within 90 days',
  },
];

export const PORTFOLIO_FEATURED = [
  {
    title: 'Villa Oceana Film',
    type: 'Cinematic Film',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    video: true,
  },
  {
    title: 'Anjuna Heights Drone',
    type: 'Aerial Photography',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    video: false,
  },
  {
    title: 'Penthouse Azure',
    type: 'Architecture Photography',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    video: false,
  },
  {
    title: 'Coastal Dreams CGI',
    type: '3D Renders',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    video: false,
  },
];

export const SECUREBUY_PACKAGES = [
  {
    name: 'Basic Check',
    price: '₹25,000',
    description: 'Essential verification for straightforward transactions',
    features: [
      'Title deed verification',
      'Encumbrance check (15 years)',
      'Property tax status',
      'Ownership chain verification',
      'Basic legal opinion',
      'Digital report delivery',
    ],
    timeline: '5-7 business days',
    highlight: false,
  },
  {
    name: 'Full Due Diligence',
    price: '₹75,000',
    description: 'Comprehensive verification for complete peace of mind',
    features: [
      'Everything in Basic Check',
      'Full 30-year title search',
      'Survey & boundary verification',
      'Building plan approvals check',
      'Environmental clearances',
      'Litigation search',
      'Municipal approvals verification',
      'Detailed legal advisory',
      'Physical property inspection',
    ],
    timeline: '10-14 business days',
    highlight: true,
  },
  {
    name: 'NRI Complete',
    price: '₹1,25,000',
    description: 'End-to-end support for overseas buyers',
    features: [
      'Everything in Full Due Diligence',
      'Power of Attorney assistance',
      'RBI/FEMA compliance check',
      'Repatriation guidance',
      'Embassy attestation support',
      'Video call property walkthrough',
      'Transaction coordination',
      'Post-purchase support (6 months)',
    ],
    timeline: '14-21 business days',
    highlight: false,
  },
];

export const SECUREBUY_VERIFICATIONS = [
  {
    icon: FileText,
    title: 'Title Verification',
    description: 'Complete ownership history and chain of title analysis',
  },
  {
    icon: Scale,
    title: 'Legal Review',
    description: 'Comprehensive legal opinion on property documentation',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Check',
    description: 'Building approvals, NOCs, and regulatory compliance',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'Identification of potential issues and red flags',
  },
];

export const SECUREBUY_PROCESS = [
  {
    step: '01',
    title: 'Engage',
    description: 'Select your package and submit property details',
  },
  {
    step: '02',
    title: 'Investigate',
    description: 'Our legal team conducts thorough verification',
  },
  {
    step: '03',
    title: 'Report',
    description: 'Receive comprehensive report with findings',
  },
  {
    step: '04',
    title: 'Advise',
    description: 'Get clear recommendations and next steps',
  },
];

export const SECUREBUY_TRUST = [
  'Expert legal team with 20+ years Goa property experience',
  'Verified 500+ properties with zero disputes',
  'Clear, jargon-free reports you can understand',
  'Money-back guarantee if issues are missed',
];

export const TURNKEY_PACKAGES = [
  {
    name: 'Consultation Package',
    desc: 'Design guidance and planning support.',
    highlight: false,
  },
  {
    name: 'Project Management Package',
    desc: 'AAYAT supervises the construction process.',
    highlight: true,
  },
  {
    name: 'Full Turnkey Package',
    desc: 'AAYAT manages the entire project from concept to handover.',
    highlight: false,
  },
];

export const DEVELOPER_AUDIENCE = [
  'Investors building premium rental homes',
  'Landowners planning their first home',
  'NRIs building property remotely',
  'Families wanting structured project management',
  'Clients wanting luxury villas',
];

export const VALUES = [
  {
    icon: 'precision',
    title: 'Precision',
    description:
      'Every campaign is strategically crafted to achieve specific, measurable outcomes.',
  },
  {
    icon: 'transparency',
    title: 'Transparency',
    description: 'Clear communication, honest reporting, and no hidden surprises\u2014ever.',
  },
  {
    icon: 'passion',
    title: 'Passion',
    description:
      'We\u2019re genuinely excited about real estate and bringing exceptional properties to life.',
  },
];

export const TEAM = [
  {
    name: 'Deepak Haldankar',
    role: 'Founder & CEO',
    bio: '15+ years in luxury real estate and hospitality marketing.',
    image:
      'https://media.base44.com/images/public/69914f7001f99553f2c3de43/30997ebb6_02A880D1-32C4-4605-952D-A7711D10E9BB.JPG',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'AAYAT transformed our property launch into a cinematic experience. The attention to detail and strategic marketing approach resulted in a sale within 30 days at our asking price.',
    author: 'Rajesh Malhotra',
    role: 'Property Developer, Anjuna',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    quote:
      'The SecureBuy process gave us complete peace of mind. As NRIs, we were nervous about purchasing remotely, but AAYAT\u2019s due diligence was thorough and professional.',
    author: 'Priya & Arjun Nair',
    role: 'Buyers from Dubai',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
  {
    quote:
      'Their media production quality is unmatched. The drone footage and cinematic film they created for our villa project generated more inquiries than any other marketing we\u2019ve done.',
    author: 'Sandeep Verma',
    role: 'MD, Verma Constructions',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
  },
];

export const CONTACT = {
  phone: '+91 914545 0039',
  email: 'hello@aayatprojects.in',
  emailAlt: 'hello@aayatprojects.com',
  address: 'Porvorim, Sangolda, Goa 403521',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  whatsapp: '919145450039',
};

export const PRICE_FILTERS = [
  { label: 'All Prices', value: 'all', min: 0, max: Infinity },
  { label: 'Under ₹1 Cr', value: 'under_1cr', min: 0, max: 10000000 },
  { label: '₹1Cr – ₹3Cr', value: '1_3cr', min: 10000000, max: 30000000 },
  { label: '₹3Cr – ₹7Cr', value: '3_7cr', min: 30000000, max: 70000000 },
  { label: '₹7Cr – ₹15Cr', value: '7_15cr', min: 70000000, max: 150000000 },
  { label: 'Above ₹15Cr', value: 'above_15cr', min: 150000000, max: Infinity },
];

export const PROPERTY_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Villa', value: 'villa' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Land', value: 'land' },
  { label: 'Mixed Use', value: 'mixed_use' },
];

export const REGIONS = [
  { label: 'All Locations', value: 'all' },
  { label: 'North Goa', value: 'north' },
  { label: 'South Goa', value: 'south' },
];

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  under_offer: 'Under Offer',
  sold: 'Sold',
  under_construction: 'Under Construction',
  coming_soon: 'Coming Soon',
  ready_to_move: 'Ready to Move',
};

export const STATUS_STYLES: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  under_offer: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  sold: 'bg-red-500/15 text-red-400 border-red-500/30',
  under_construction: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  coming_soon: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  ready_to_move: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  planning: 'Coming Soon',
  under_construction: 'Under Construction',
  completed: 'Completed',
};
