export default function Privacy() {
  return (
    <div className="bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl font-medium text-stone-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
          <p>Last updated: {new Date().getFullYear()}</p>
          <p>AAYAT Projects ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Information We Collect</h2>
          <p>We collect information you provide through our contact forms, booking requests, and inquiries, including your name, email address, phone number, and any message content.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">How We Use Your Information</h2>
          <p>Your information is used solely to respond to your inquiries, process bookings, and provide our real estate services. We do not sell or share your data with third parties.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Data Security</h2>
          <p>All data is stored securely using Supabase with row-level security policies. Access is restricted to authorized administrative personnel only.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@aayatprojects.in.</p>
        </div>
      </div>
    </div>
  );
}
