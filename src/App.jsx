import { useState, useMemo } from 'react'
import { Search, Filter, Building, Globe, Users, TrendingUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import companiesData from './assets/companies_database.json'
import affiliateData from './assets/affiliate_companies.json'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

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

  const Header = () => (
    <header className="gradient-header py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-white text-shadow">Mushrooms.ink</h1>
          {currentPage !== 'home' && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage('home')}
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>
        <p className="text-xl text-green-50">
          Comprehensive Mushroom & Mycelium Company Database
        </p>
        <nav className="mt-6 flex gap-4">
          <Button 
            variant={currentPage === 'home' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('home')}
            className={currentPage === 'home' ? '' : 'text-gray-900 border-gray-900 hover:bg-gray-100 hover:text-green-600'}
          >
            Companies
          </Button>
          <Button 
            variant={currentPage === 'research' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('research')}
            className={currentPage === 'research' ? '' : 'text-gray-900 border-gray-900 hover:bg-gray-100 hover:text-green-600'}
          >
            Research
          </Button>
          <Button 
            variant={currentPage === 'reports' ? 'secondary' : 'outline'}
            onClick={() => setCurrentPage('reports')}
            className={currentPage === 'reports' ? '' : 'text-gray-900 border-gray-900 hover:bg-gray-100 hover:text-green-600'}
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
            <Input
              placeholder="Search companies, products, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 search-focus"
            />
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries ({companiesData.length})</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry} ({industryCounts[industry]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="founded">Newest First</SelectItem>
              <SelectItem value="innovation">Innovation Level</SelectItem>
            </SelectContent>
          </Select>
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
          <div className="text-right">
            <div className="text-xs text-gray-500">Founded {company.founded}</div>
            <div className="text-xs text-gray-500">{company.employees} employees</div>
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
        {company.website && (
          <a 
            href={`https://${company.website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
          >
            Visit Website →
          </a>
        )}
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

  const ResearchPage = () => (
    <main className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>The Future of Mycelium Materials</CardTitle>
              <CardDescription>Biomaterials • Published Dec 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Exploring the latest developments in mycelium-based materials and their applications in fashion, packaging, and construction industries.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Sustainability</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Innovation</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Alternative Protein Market Analysis</CardTitle>
              <CardDescription>Food & Beverage • Published Nov 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive analysis of the mushroom-based alternative protein market, including growth projections and key players.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Market Research</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Food Tech</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Functional Mushrooms in Healthcare</CardTitle>
              <CardDescription>Health & Wellness • Published Oct 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Research on the therapeutic potential of functional mushrooms and their integration into modern healthcare practices.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Healthcare</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Clinical Research</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )

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
              <a href="https://mushrooms-ink.vercel.app/pdfs/Mushroom_Industry_Overview_2024.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
              <a href="https://mushrooms-ink.vercel.app/pdfs/Biomaterials_Sector_Report.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
              <a href="https://mushrooms-ink.vercel.app/pdfs/Alternative_Protein_Landscape.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
              <a href="https://mushrooms-ink.vercel.app/pdfs/Health_Wellness_Segment.pdf" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
      <footer className="bg-gray-800 text-white py-6 px-4 text-center mt-auto">
        <div className="max-w-7xl mx-auto">
          <p>&copy; 2024 Mushrooms.ink. All rights reserved.</p>
          <p className="text-sm mt-2">Disclaimer: The information provided on this website is for general informational purposes only and does not constitute professional advice.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

