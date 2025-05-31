"use client";

import { useState, useEffect } from "react";

import {

  ArrowRight,
  Kanban,
  BarChart3,
  Users,
  Menu,
  X,
  GanttChartSquare,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";


const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    testimonials: false,
    pricing: false,
  });

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Check visibility for animations
      const sections = [
        "hero",
        "features",
        "howItWorks",
        "testimonials",
      ];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView =
            rect.top < window.innerHeight - 100 && rect.bottom > 0;
          setIsVisible((prev) => ({ ...prev, [section]: isInView }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Cycle through features automatically
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(featureInterval);
    };
  }, []);

  // Features data
  const features = [
    {
      title: "Kanban Boards",
      description:
        "Visualize your workflow and move tasks through customizable stages from backlog to completion.",
      icon: <Kanban className="w-8 h-8 text-blue-500" />,
      color: "blue",
    },
    {
      title: "Task Tracking",
      description:
        "Create, assign and track tasks with detailed descriptions, due dates, and priority levels.",
      icon: <ListChecks className="w-8 h-8 text-green-500" />,
      color: "green",
    },
    {
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates, comments, and @mentions.",
      icon: <Users className="w-8 h-8 text-purple-500" />,
      color: "purple",
    },
    {
      title: "Analytics & Reports",
      description:
        "Gain insights into team productivity with customizable dashboards and reports.",
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      color: "orange",
    },
    {
      title: "Sprint Planning",
      description:
        "Plan sprints, set goals, and track progress with our agile planning tools.",
      icon: <GanttChartSquare className="w-8 h-8 text-red-500" />,
      color: "red",
    },
  ];

 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-900/95"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L20 8V16L12 20L4 16V8L12 4Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 4V20" stroke="white" strokeWidth="2" />
                  <path d="M4 8L20 16" stroke="white" strokeWidth="2" />
                  <path d="M20 8L4 16" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                Trek<span className="text-blue-600">Flow</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("howItWorks")}
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                How it Works
              </button>
             
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => router.push("/sign-in")}
              >
                Log in
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" onClick={()=>{router.push('/sign-up')}}>
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  scrollToSection("features");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection("howItWorks");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                How it Works
              </button>
              <button
                onClick={() => {
                  scrollToSection("pricing");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Pricing
              </button>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <button className="block px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  Log in
                </button>
                <button className="mt-2 block w-full px-3 py-2 text-center rounded-md text-white bg-blue-600 hover:bg-blue-700" onClick={()=>{router.push('/sign-up')}}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          id="hero"
          className={cn(
            "min-h-screen pt-16 flex items-center transition-opacity duration-1000 ease-in-out",
            isVisible.hero ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Manage Projects{" "}
                  <span className="text-blue-600">Efficiently</span> with
                  TrekFlow
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  The most intuitive Jira alternative that helps teams track
                  issues, manage projects, and streamline workflows in one
                  place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"  onClick={()=>{router.push('/sign-up')}}>
                    Get Started
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="px-8 py-4 text-lg font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center"
                  >
                    See Features <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-${i * 100}`}
                      ></div>
                    ))}
                  </div>
                  <p className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                    Join <span className="font-bold">2,000+</span> teams already
                    using TrekFlow
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-10"></div>
                  <Image
                    src="https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="TrekFlow Dashboard Preview"
                    className="w-full h-auto z-0 rounded-2xl"
                    height={100}
                    width={100}
                  />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={cn(
            "py-20 bg-gray-50 dark:bg-gray-900 transition-all duration-1000 ease-in-out",
            isVisible.features
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Features That Streamline Your Workflow
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                TrekFlow brings all your tasks, projects, and collaboration into
                one place.
              </p>
            </div>

            <div className=" gap-8 mb-16">
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
                <div
                  className={`absolute top-0 left-0 h-2 w-full bg-${features[activeFeature].color}-500 rounded-t-2xl`}
                ></div>
                {features[activeFeature].icon}
                <h3 className="text-2xl font-bold mt-4 mb-2">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {features[activeFeature].description}
                </p>
                <div className="mt-6 flex gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-3 h-3 rounded-full ${index === activeFeature ? `bg-${features[index].color}-500` : "bg-gray-300 dark:bg-gray-600"} transition-all`}
                      aria-label={`View feature ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* <div className="relative bg-white dark:bg-gray-800 overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
                <div className="relative p-8">
                  <Image
                    src="https://images.pexels.com/photos/7439141/pexels-photo-7439141.jpeg"
                    alt="TrekFlow Features"
                    className="w-full h-auto rounded-xl shadow-md"
                    height={100}
                    width={100}
                  />
                </div>
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
                    activeFeature === index && "ring-2 ring-blue-500"
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="howItWorks"
          className={cn(
            "py-20 transition-all duration-1000 ease-in-out",
            isVisible.howItWorks
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How TrekFlow Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get started in minutes with our intuitive project management
                platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Create Projects",
                  description:
                    "Set up your project, invite team members, and define your workflow stages.",
                  icon: <GanttChartSquare className="w-8 h-8 text-blue-500" />,
                  delay: 100,
                },
                {
                  title: "Add Tasks",
                  description:
                    "Create tasks with descriptions, assignees, due dates, and priorities.",
                  icon: <ListChecks className="w-8 h-8 text-green-500" />,
                  delay: 200,
                },
                {
                  title: "Track Progress",
                  description:
                    "Monitor task progress through your workflow and generate insights.",
                  icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
                  delay: 300,
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transition-all hover:shadow-xl"
                  style={{
                    transitionDelay: `${step.delay}ms`,
                    opacity: isVisible.howItWorks ? 1 : 0,
                    transform: isVisible.howItWorks
                      ? "translateY(0)"
                      : "translateY(20px)",
                  }}
                >
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                  <div className="mt-6 text-blue-600 font-medium flex items-center justify-center">
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className={cn(
            "py-20 bg-gray-50 dark:bg-gray-900 transition-all duration-1000 ease-in-out",
            isVisible.testimonials
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Loved by Teams Worldwide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our customers have to say about TrekFlow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "TrekFlow has transformed how our engineering team manages sprints. The Kanban view is intuitive and powerful.",
                  author: "Sarah Johnson",
                  role: "CTO, TechNova",
                  avatar:
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
                {
                  quote:
                    "After trying multiple project management tools, TrekFlow is the only one that truly matched our workflow needs.",
                  author: "Michael Chang",
                  role: "Product Manager, DesignHub",
                  avatar:
                    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
                {
                  quote:
                    "The analytics features in TrekFlow gave us insights we never had before. Our team productivity has increased by 37%.",
                  author: "Elena Rodriguez",
                  role: "Scrum Master, AgileWorks",
                  avatar:
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                        height={100}
                        width={100}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mt-4 flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-xl font-bold mb-8">
                Trusted by innovative companies
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                {["Microsoft", "Airbnb", "Spotify", "Netflix", "Slack"].map(
                  (company, index) => (
                    <div
                      key={index}
                      className="text-xl sm:text-2xl font-bold text-gray-400 dark:text-gray-500"
                    >
                      {company}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to streamline your workflow?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of teams already using TrekFlow to manage
                projects efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"  onClick={()=>{router.push('/sign-up')}}>
                  Get Started
                </button>
                <button className="px-8 py-4 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Schedule a Demo
                </button>
              </div>
            
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L20 8V16L12 20L4 16V8L12 4Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 4V20" stroke="white" strokeWidth="2" />
                    <path d="M4 8L20 16" stroke="white" strokeWidth="2" />
                    <path d="M20 8L4 16" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">
                  Trek<span className="text-blue-500">Flow</span>
                </span>
              </div>
              <p className="text-sm mb-4">
                Modern project management for teams of all sizes.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="w-6 h-6"></div>
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Integrations",
                  "Changelog",
                  "Roadmap",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                {["Documentation", "Guides", "API", "Community", "Support"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Blog", "Legal", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 TrekFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
