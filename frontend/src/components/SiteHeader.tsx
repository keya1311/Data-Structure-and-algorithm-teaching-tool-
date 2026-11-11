function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        Algora
      </a>

      <nav aria-label="Main navigation">
        <a className="nav-link active" href="/">
          Home
        </a>
        <a className="nav-link" href="#topics">
          Topics
        </a>
        <a className="nav-link" href="#progress">
          Progress
        </a>
      </nav>

      <button className="account-button" type="button">
        Sign in
      </button>
    </header>
  )
}

export default SiteHeader
