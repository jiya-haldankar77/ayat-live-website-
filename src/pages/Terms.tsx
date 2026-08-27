export default function Terms() {
  return (
    <div className="bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl font-medium text-stone-900 mb-6">Terms of Service</h1>
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
          <p>Last updated: {new Date().getFullYear()}</p>
          <p>By accessing and using the AAYAT Projects website, you agree to be bound by these terms and conditions.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Use of Service</h2>
          <p>This website provides information about luxury real estate properties in Goa. All property details, pricing, and availability are subject to change without notice.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Bookings & Inquiries</h2>
          <p>Submitting a booking request or inquiry does not constitute a binding agreement. All bookings are subject to confirmation by our team.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Intellectual Property</h2>
          <p>All content on this website, including images, videos, and text, is the property of AAYAT Projects and may not be reproduced without permission.</p>
          <h2 className="font-display text-2xl text-stone-900 mt-8 mb-3">Limitation of Liability</h2>
          <p>AAYAT Projects shall not be liable for any damages arising from the use of this website or reliance on information presented herein.</p>
        </div>
      </div>
    </div>
  );
}
