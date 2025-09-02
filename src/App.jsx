import { useState, useMemo } from 'react'
import { Search, Filter, Building, Globe, Users, TrendingUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import companiesData from './assets/companies_database.json'
import researchData from './assets/research_articles.json'
import affiliateData from './assets/affiliate_companies.json'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  
  // Research page state
  const [researchSearchTerm, setResearchSearchTerm] = useState('')
  const [researchCategoryFilter, setResearchCategoryFilter] = useState('all')
  const [researchSortBy, setResearchSortBy] = useState('year')

  // Get unique industries from the data
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(companiesData.map(company => company.industry))]
    return uniqueIndustries
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalCompanies = companiesData.length
    const totalIndustries = industries.length
    const countries = [...new Set(companiesData.map(company => company.country))].length
    const totalEmployees = companiesData.reduce((sum, company) => {
      const employees = company.employees
      if (employees.includes('500+')) return sum + 750
      if (employees.includes('100-500')) return sum + 300
      if (employees.includes('50-100')) return sum + 75
      if (employees.includes('10-50')) return sum + 30
      return sum + 5
    }, 0)

    return {
      companies: totalCompanies,
      industries: totalIndustries,
      countries,
      employees: totalEmployees
    }
  }, [industries])

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let filtered = companiesData.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.products.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.technologies.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.target.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter

      return matchesSearch && matchesIndustry
    })

    // Sort companies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'founded':
          return b.founded - a.founded
        case 'innovation':
          const innovationOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          return innovationOrder[b.innovation] - innovationOrder[a.innovation]
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, industryFilter, sortBy])

  // Get industry counts for filter dropdown
  const industryCounts = useMemo(() => {
    const counts = {}
    companiesData.forEach(company => {
      counts[company.industry] = (counts[company.industry] || 0) + 1
    })
    return counts
  }, [])

  // Research articles logic
  const researchCategories = useMemo(() => {
    const uniqueCategories = [...new Set(researchData.map(article => article.category))]
    return uniqueCategories.filter(cat => cat !== 'Category') // Remove invalid category
  }, [])

  const filteredResearchArticles = useMemo(() => {
    let filtered = researchData.filter(article => {
      const matchesSearch = researchSearchTerm === '' || 
        article.title.toLowerCase().includes(researchSearchTerm.toLowerCase()) ||
        article.authors.toLowerCase().includes(researchSearchTerm.toLowerCase()) ||
        article.journal.toLowerCase().includes(researchSearchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(researchSearchTerm.toLowerCase()) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(researchSearchTerm.toLowerCase()))

      const matchesCategory = researchCategoryFilter === 'all' || article.category === researchCategoryFilter

      return matchesSearch && matchesCategory && article.category !== 'Category'
    })

    filtered.sort((a, b) => {
      switch (researchSortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'year':
          return b.year - a.year
        case 'category':
          return a.category.localeCompare(b.category)
        case 'journal':
          return a.journal.localeCompare(b.journal)
        default:
          return 0
      }
    })

    return filtered
  }, [researchSearchTerm, researchCategoryFilter, researchSortBy])

  const researchCategoryCounts = useMemo(() => {
    const counts = {}
    researchData.forEach(article => {
      if (article.category !== 'Category') {
        counts[article.category] = (counts[article.category] || 0) + 1
      }
    })
    return counts
  }, [])

  const Header = () => (
    <header className="gradient-header py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src="/logo.png" 
              alt="Mushrooms.ink Logo" 
              className="h-12 sm:h-16 w-auto flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-shadow truncate">
                Mushrooms.ink
              </h1>
              <p className="text-sm sm:text-lg lg:text-xl text-green-50 mt-1 leading-tight">
                Comprehensive Mushroom & Mycelium Company Database
              </p>
            </div>
          </div>
          {currentPage !== 'home' && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('home')}
              className="text-white border-white hover:bg-white hover:text-green-600 flex-shrink-0 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>
        <nav className="mt-4 flex flex-wrap gap-2 sm:gap-4">
          <Button 
            variant={currentPage === 'home' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('home')}
            className={`text-sm sm:text-base ${currentPage === 'home' ? 'bg-white text-green-600' : 'text-white border-white hover:bg-white hover:text-green-600'}`}
          >
            Companies
          </Button>
          <Button 
            variant={currentPage === 'research' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('research')}
            className={`text-sm sm:text-base ${currentPage === 'research' ? 'bg-white text-green-600' : 'text-white border-white hover:bg-white hover:text-green-600'}`}
          >
            Research
          </Button>
          <Button 
            variant={currentPage === 'reports' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('reports')}
            className={`text-sm sm:text-base ${currentPage === 'reports' ? 'bg-white text-green-600' : 'text-white border-white hover:bg-white hover:text-green-600'}`}
          >
            Industry Reports
          </Button>
        </nav>
      </div>
    </header>
  )

  const StatsSection = () => (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.companies}</div>
              <div className="text-sm text-gray-600">Companies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Filter className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.industries}</div>
              <div className="text-sm text-gray-600">Industries Tracked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.countries}</div>
              <div className="text-sm text-gray-600">Countries Represented</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.employees.toLocaleString()}+</div>
              <div className="text-sm text-gray-600">Total Employees</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )

  const SearchAndFilter = () => (
    <section className="py-4 px-4 bg-white border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search companies, products, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              autoComplete="off"
            />
          </div>
          <select 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full md:w-64 h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <option value="all">All Industries ({companiesData.length})</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>
                {industry} ({industryCounts[industry]})
              </option>
            ))}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-48 h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <option value="name">Name A-Z</option>
            <option value="founded">Newest First</option>
            <option value="innovation">Innovation Level</option>
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredCompanies.length} of {companiesData.length} companies
        </div>
      </div>
    </section>
  )

  const CompanyCard = ({ company }) => (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {company.name}
            </CardTitle>
            <CardDescription className="text-green-600 font-medium">
              {company.industry} • {company.country}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{company.products}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            {company.businessModel}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {company.stage}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
            Innovation: {company.innovation}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{company.description}</p>
        {company.affiliate && company.affiliateUrl ? (
          <div className="mt-2">
            <a 
              href={company.affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm font-medium inline-block"
            >
              Visit Website →
            </a>
            <div className="text-xs text-orange-600 font-medium mt-1">
              {company.discountAmount} discount code: {company.discountCode}
            </div>
          </div>
        ) : company.website ? (
          <a 
            href={`https://${company.website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
          >
            Visit Website →
          </a>
        ) : null}
      </CardContent>
    </Card>
  )

  const HomePage = () => (
    <main>
      <StatsSection />
      <SearchAndFilter />
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No companies found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setIndustryFilter('all')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )

  const ResearchPage = () => {
    const ResearchSearchAndFilter = () => (
      <section className="py-6 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles, authors, journals..."
                value={researchSearchTerm}
                onChange={(e) => setResearchSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={researchCategoryFilter} 
                onChange={(e) => setResearchCategoryFilter(e.target.value)}
                className="w-48 h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                <option value="all">All Categories ({filteredResearchArticles.length})</option>
                {researchCategories.map(category => (
                  <option key={category} value={category}>
                    {category} ({researchCategoryCounts[category]})
                  </option>
                ))}
              </select>
              <select 
                value={researchSortBy} 
                onChange={(e) => setResearchSortBy(e.target.value)}
                className="w-40 h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                <option value="year">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="category">Category</option>
                <option value="journal">Journal</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResearchArticles.length} of {researchData.filter(a => a.category !== 'Category').length} research articles
          </div>
        </div>
      </section>
    )

    const ResearchCard = ({ article }) => (
      <Card className="card-hover h-full">
        <CardHeader>
          <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
          <CardDescription>
            {article.authors} • {article.year} • {article.journal}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded mr-2">
              {article.category}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-2">
              {article.subcategory}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              {article.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {article.summary}
          </p>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 text-sm font-medium inline-block"
          >
            Read Full Article →
          </a>
        </CardContent>
      </Card>
    )

    return (
      <main>
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Articles</h2>
            <p className="text-gray-600 mb-8">
              Curated collection of the latest research in mushroom and mycelium technologies across industries.
            </p>
          </div>
        </div>
        
        <ResearchSearchAndFilter />
        
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResearchArticles.map(article => (
                <ResearchCard key={article.id} article={article} />
              ))}
            </div>
            {filteredResearchArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No research articles found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setResearchSearchTerm('')
                    setResearchCategoryFilter('all')
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    )
  }

  const IndustryReportsPage = () => (
    <main className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Industry Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Mushroom Industry Overview 2024</CardTitle>
              <CardDescription>Comprehensive market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Market size and growth projections</li>
                <li>• Key industry segments analysis</li>
                <li>• Investment trends and funding patterns</li>
                <li>• Geographic distribution insights</li>
              </ul>
              <a href="/Mushroom_Industry_Overview_2024.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Download Report
              </a>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Biomaterials Sector Report</CardTitle>
              <CardDescription>Focus on mycelium-based materials</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Technology advancement timeline</li>
                <li>• Major partnerships and collaborations</li>
                <li>• Sustainability impact assessment</li>
                <li>• Future market opportunities</li>
              </ul>
              <a href="/Biomaterials_Sector_Report.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Download Report
              </a>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Alternative Protein Landscape</CardTitle>
              <CardDescription>Mushroom-based protein companies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Market size and growth projections</li>
                <li>• Key industry segments analysis</li>
                <li>• Investment trends and funding patterns</li>
                <li>• Geographic distribution insights</li>
              </ul>
              <a href="/Alternative_Protein_Landscape.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Download Report
              </a>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Health & Wellness Segment</CardTitle>
              <CardDescription>Focus on functional mushrooms</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Health benefits and scientific research</li>
                <li>• Product development and innovation</li>
                <li>• Consumer trends and market adoption</li>
                <li>• Regulatory landscape and challenges</li>
              </ul>
              <a href="/Health_Wellness_Segment.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Download Report
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'research' && <ResearchPage />}
      {currentPage === 'reports' && <IndustryReportsPage />}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Mushrooms.ink</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Comprehensive database of mushroom and mycelium companies across 7 industries.
              </p>
              <div className="mt-4">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.companies}</div>
                <div className="text-xs sm:text-sm text-gray-400">Companies Tracked</div>
              </div>
              <div className="mt-4">
                <a 
                  href="mailto:success@ednye.com?subject=Submit Company for Review - Mushrooms.ink&body=Company Name:%0D%0AWebsite:%0D%0AIndustry:%0D%0ACountry:%0D%0AProducts/Services:%0D%0AAdditional Information:"
                  className="inline-block px-3 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Submit a Company
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Industries</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                {industries.map(industry => (
                  <li key={industry} className="hover:text-green-400 cursor-pointer break-words">
                    {industry} ({industryCounts[industry]})
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Research</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li>
                  <button 
                    onClick={() => setCurrentPage('research')}
                    className="hover:text-green-400 text-left"
                  >
                    Research Articles
                  </button>
                </li>
                <li className="text-gray-400">• Mycelium Materials</li>
                <li className="text-gray-400">• Alternative Proteins</li>
                <li className="text-gray-400">• Functional Mushrooms</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Industry Reports</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li>
                  <button 
                    onClick={() => setCurrentPage('reports')}
                    className="hover:text-green-400 text-left"
                  >
                    Download Reports
                  </button>
                </li>
                <li className="text-gray-400">• Market Overview 2024</li>
                <li className="text-gray-400">• Biomaterials Sector</li>
                <li className="text-gray-400">• Health & Wellness</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Mushrooms.ink. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-2">
              Disclaimer: Information provided is for general purposes only and does not constitute professional advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

