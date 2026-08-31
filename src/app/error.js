"use client";

export default function ErrorPage({ reset }) {
  return <section className="error-page"><div><p className="eyebrow">Something went wrong</p><h1 className="display">We hit an unexpected detour.</h1><p className="muted">Please retry. If the problem continues, check the API configuration.</p><button className="btn btn-primary" onClick={reset}>Try again</button></div></section>;
}
