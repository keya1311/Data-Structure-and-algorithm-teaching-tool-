function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav aria-label="Main navigation">
        <a className="nav-link active" href="/" aria-current="page">Home</a>
        <a className="nav-link" href="#topics">Algorithms</a>
        <a className="nav-link" href="#binary-search">Binary search</a>
      </nav>
      <a className="header-action" href="#topics">Explore concepts <span aria-hidden="true">→</span></a>
    </header>
  )
}

export default SiteHeader
