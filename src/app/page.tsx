import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float delay-500"></div>
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Glassmorphism Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="font-playfair text-3xl font-bold text-white drop-shadow-lg">
                SocialAI
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">How It Works</a>
              <a href="#pricing" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">Pricing</a>
              <Link href="/auth" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">Sign In</Link>
              <Link href="/auth" className="relative overflow-hidden bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 group">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spectacular Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in-down">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              AI-Powered Social Media Revolution
            </div>
            
            <h1 className="font-playfair text-7xl md:text-9xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
              Transform Ideas Into
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Viral Content
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up delay-300">
              Harness the power of advanced AI to create compelling social media content that 
              <span className="text-cyan-300 font-semibold"> engages</span>,
              <span className="text-purple-300 font-semibold"> converts</span>, and
              <span className="text-pink-300 font-semibold"> grows your audience</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in-up delay-500">
              <Link href="/auth" className="group relative overflow-hidden px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 min-w-[280px]">
                <span className="relative z-10 flex items-center justify-center">
                  Start Creating Magic
                  <svg className="inline ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link href="#demo" className="group px-12 py-6 border-3 border-white/30 backdrop-blur-sm text-white rounded-2xl font-bold text-xl transition-all duration-500 hover:bg-white/10 hover:border-white/50 hover:shadow-2xl hover:scale-105 min-w-[280px]">
                <span className="flex items-center justify-center">
                  Watch Demo
                  <svg className="inline ml-3 w-6 h-6 group-hover:scale-125 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Spectacular Platform Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in-up delay-700">
              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-cyan-500/50 group-hover:scale-125 transition-all duration-500 border border-white/20 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <p className="text-white/90 font-semibold group-hover:text-cyan-300 transition-colors">Twitter</p>
              </div>
              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-blue-500/50 group-hover:scale-125 transition-all duration-500 border border-white/20 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <p className="text-white/90 font-semibold group-hover:text-blue-300 transition-colors">LinkedIn</p>
              </div>
              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-700 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-pink-500/50 group-hover:scale-125 transition-all duration-500 border border-white/20 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white group-hover:text-pink-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <p className="text-white/90 font-semibold group-hover:text-pink-300 transition-colors">Instagram</p>
              </div>
              <div className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-blue-400/50 group-hover:scale-125 transition-all duration-500 border border-white/20 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <p className="text-white/90 font-semibold group-hover:text-blue-300 transition-colors">Facebook</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spectacular Features Section */}
      <section id="features" className="py-32 relative z-10 bg-black/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24 animate-fade-in-up">
            <h2 className="font-playfair text-6xl md:text-7xl font-bold text-white mb-8">
              Powerful Features
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto font-light leading-relaxed">
              Everything you need to dominate social media with AI-powered precision and creativity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/25">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-cyan-300 transition-colors">AI-Powered Generation</h3>
              <p className="text-white/80 text-lg leading-relaxed">Advanced machine learning algorithms analyze your content and generate platform-optimized posts that maximize engagement and reach across all social networks.</p>
            </div>
            
            <div className="group p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-purple-300 transition-colors">Multi-Platform Mastery</h3>
              <p className="text-white/80 text-lg leading-relaxed">Create content perfectly tailored for Twitter, LinkedIn, Instagram, and Facebook with platform-specific character limits, hashtags, and engagement strategies.</p>
            </div>
            
            <div className="group p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-pink-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-pink-500/25">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-pink-300 transition-colors">Smart Analytics</h3>
              <p className="text-white/80 text-lg leading-relaxed">Track performance metrics, engagement rates, and optimize your content strategy with detailed insights and actionable recommendations powered by AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spectacular How It Works Section */}
      <section id="how-it-works" className="py-32 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24 animate-fade-in-up">
            <h2 className="font-playfair text-6xl md:text-7xl font-bold text-white mb-8">
              How The Magic Works
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto font-light leading-relaxed">
              Transform your ideas into viral content in three spectacular steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center group animate-fade-in-up delay-100">
              <div className="relative mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white text-4xl font-bold">1</span>
                </div>
                <div className="absolute -inset-4 rounded-full border-2 border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-500 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-cyan-300 transition-colors">Input Your Brilliance</h3>
              <p className="text-white/80 text-lg leading-relaxed">Paste your blog article, brilliant idea, or any text content that you want to transform into captivating social media posts.</p>
            </div>
            
            <div className="text-center group animate-fade-in-up delay-300">
              <div className="relative mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white text-4xl font-bold">2</span>
                </div>
                <div className="absolute -inset-4 rounded-full border-2 border-purple-400/30 group-hover:border-purple-400/60 transition-all duration-500 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-purple-300 transition-colors">AI Magic Processing</h3>
              <p className="text-white/80 text-lg leading-relaxed">Our advanced AI analyzes your content and generates optimized, engaging posts perfectly tailored for each social media platform.</p>
            </div>
            
            <div className="text-center group animate-fade-in-up delay-500">
              <div className="relative mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-pink-500/50 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white text-4xl font-bold">3</span>
                </div>
                <div className="absolute -inset-4 rounded-full border-2 border-pink-400/30 group-hover:border-pink-400/60 transition-all duration-500 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-pink-300 transition-colors">Publish & Go Viral</h3>
              <p className="text-white/80 text-lg leading-relaxed">Copy your generated content and publish it across your social media platforms to maximize engagement and watch your audience grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spectacular CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl animate-float delay-1000"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-playfair text-6xl md:text-8xl font-bold text-white mb-8 animate-fade-in-up">
            Ready to Go Viral?
          </h2>
          <p className="text-2xl text-white/90 mb-16 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
            Join thousands of creators who are already using SocialAI to transform their content strategy and explode their audience growth
          </p>
          <Link href="/auth" className="inline-flex items-center px-16 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-2xl hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500 hover:shadow-2xl hover:scale-110 animate-fade-in-up delay-400 group">
            <span className="relative z-10">Start Your Journey</span>
            <svg className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Spectacular Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/20 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-playfair text-3xl font-bold text-white mb-6 md:mb-0">
              SocialAI
            </div>
            <div className="flex space-x-8 text-white/80">
              <a href="#" className="hover:text-white transition-colors hover:scale-105 duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-colors hover:scale-105 duration-300">Terms</a>
              <a href="#" className="hover:text-white transition-colors hover:scale-105 duration-300">Support</a>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2024 SocialAI. All rights reserved. Made with ❤️ and AI magic.</p>
          </div>
        </div>
      </footer>
    </>
  )
}