export function SignInConcept() {
  return (
    <div className="kh-concept-page kh-concept-signin">
      <div className="kh-concept-brand">
        <img
          src="/projects/khdamli/hero.webp"
          alt="Home service professional at work in the KHdamli concept preview"
          width="428"
          height="328"
          loading="lazy"
          decoding="async"
        />
        <img
          className="kh-concept-logo"
          src="/projects/khdamli/logo.webp"
          alt="KHdamli home services logo"
          width="436"
          height="228"
          loading="lazy"
          decoding="async"
        />
        <strong>Home Services App</strong>
      </div>
      <div className="kh-concept-login">
        <h3>Welcome back</h3>
        <div className="kh-concept-input">Email or Phone</div>
        <div className="kh-concept-input">Password</div>
        <span>Forgot Password ?</span>
        <div className="kh-concept-button">Login</div>
        <span className="kh-concept-or">or</span>
        <div className="kh-concept-button soft">Create an account</div>
      </div>
    </div>
  )
}
