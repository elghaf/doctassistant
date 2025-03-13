import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useAction, useQuery } from "convex/react";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";

const FEATURES = [
  {
    icon: "⚡️",
    title: "React + Vite",
    description: "Lightning-fast development with modern tooling and instant HMR"
  },
  {
    icon: "🔐",
    title: "Clerk Auth",
    description: "Secure authentication and user management out of the box"
  },
  {
    icon: "🚀",
    title: "Convex BaaS",
    description: "Real-time backend with automatic scaling and TypeScript support"
  },
  {
    icon: "💳",
    title: "Stripe",
    description: "Seamless payment integration for your SaaS"
  }
] as const;

const TESTIMONIALS = [
  {
    content: "The integration between Convex and React is incredible. Real-time updates work out of the box, and the type safety across the full stack is a game changer.",
    author: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "ScaleSync",
    image: "https://images.unsplash.com/photo-1551651639-927b595f815c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    content: "Clerk's authentication was a breeze to set up. Combined with Vite's lightning-fast HMR, our development velocity has increased significantly.",
    author: "Michael Rodriguez",
    role: "Tech Lead",
    company: "DevFlow",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop"
  },
  {
    content: "The Stripe integration made monetization simple. From subscription management to usage-based billing, everything just works seamlessly.",
    author: "Emily Thompson",
    role: "Founder",
    company: "SaaSforge",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
  }
];

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const subscriptionStatus = useQuery(api.subscriptions.getUserSubscriptionStatus);
  const getProducts = useAction(api.subscriptions.getProducts);
  const [products, setProducts] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    const result = async () => {
      const products = await getProducts();
      setProducts(products?.data);
      return products;
    }
    result();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <div className="relative flex flex-col items-center text-center space-y-6 pb-24">
            <div className="absolute inset-x-0 -top-24 -bottom-24 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <div className="inline-flex items-center gap-2 rounded-[20px] bg-[#0066CC]/10 px-4 py-2">
              <Star className="h-4 w-4 text-[#0066CC]" />
              <span className="text-sm font-medium text-[#0066CC]">2.1k+ Stars on GitHub</span>
            </div>
            <h1 className="text-6xl font-semibold text-[#1D1D1F] tracking-tight max-w-[800px] leading-[1.1]">
              Build your next great idea with Tempo React Starter
            </h1>
            <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed">
              Launch your next project faster with our modern tech stack. Beautiful, powerful, and ready to scale.
            </p>

            <div className="flex items-center gap-5 pt-4">
              <Button 
                variant="default"
                className="h-12 px-8 text-base rounded-[14px] bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-sm transition-all"
              >
                Get Started
              </Button>
              <Button 
                variant="ghost" 
                className="h-12 px-8 text-base rounded-[14px] text-[#0066CC] hover:text-[#0077ED] hover:bg-[#0066CC]/10 transition-all"
              >
                Documentation
              </Button>
            </div>
          </div>

          {/* Examples Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-24">
            {FEATURES.map(feature => (
              <div 
                key={feature.title} 
                className="group rounded-[20px] bg-white p-6 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="text-2xl mb-4 transform-gpu transition-transform group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">{feature.title}</h3>
                <p className="text-base text-[#86868B] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">Loved by developers</h2>
              <p className="text-xl text-[#86868B]">Here's what people are saying about our starter kit.</p>
            </div>
            <div className="space-y-24">
              {TESTIMONIALS.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div className="max-w-xl">
                      <p className="text-[32px] font-medium text-[#1D1D1F] mb-8 leading-tight">{testimonial.content}</p>
                      <div className="space-y-1">
                        <div className="text-xl font-semibold text-[#1D1D1F]">{testimonial.author}</div>
                        <div className="text-lg text-[#86868B]">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-[#F5F5F7]">
                      <img 
                        src={testimonial.image} 
                        alt={`${testimonial.author}'s workspace`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <section id="pricing" className="relative py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <div className="flex flex-col items-center text-center relative">
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">Simple, Transparent Pricing</h2>
                <p className="text-xl text-[#86868B]">Choose the plan that's right for you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {products?.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    price={{
                      id: plan.id,
                      amount: plan.amount,
                      interval: plan.interval,
                      currency: plan.currency
                    }}
                    product={{
                      id: plan.product,
                      name: plan.interval === 'month' ? 'Monthly Plan' : 'Yearly Plan',
                      description: `${plan.currency.toUpperCase()} ${(plan.amount / 100).toFixed(2)}/${plan.interval}`
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="py-24">
            <div className="rounded-[32px] bg-gradient-to-b from-[#0066CC] to-[#0077ED] p-16 text-center text-white">
              <h2 className="text-4xl font-semibold mb-4">Ready to get started?</h2>
              <p className="text-xl mb-8 text-white/90">Join thousands of developers building with our starter kit.</p>
              <div className="flex items-center justify-center gap-5">
                <Button 
                  variant="default"
                  className="h-12 px-8 text-base rounded-[14px] bg-white text-[#0066CC] hover:bg-white/90 transition-all"
                >
                  Get Started
                </Button>
                <Button 
                  className="h-12 px-8 text-base rounded-[14px] border-white/20 text-white hover:bg-white/10 group transition-all"
                >
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;