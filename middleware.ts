import { createSecureMiddleware } from "websecure-ez";

const isDev = process.env.NODE_ENV !== "production";

const secureMiddleware = createSecureMiddleware({
  contentSecurityPolicy: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: isDev
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
        : ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: isDev ? ["'self'", "ws:", "http:", "https:"] : ["'self'", "https:"],
      objectSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: !isDev,
    },
    reportOnly: false,
  },
  xFrameOptions: {
    enabled: true,
    option: "DENY",
  },
  referrerPolicy: {
    enabled: true,
    policy: "strict-origin-when-cross-origin",
  },
  permissionsPolicy: {
    enabled: true,
    features: {
      camera: "'none'",
      microphone: "'none'",
      geolocation: "'none'",
      payment: "'none'",
      usb: "'none'",
    },
  },
  xContentTypeOptions: {
    enabled: true,
  },
  xssProtection: {
    enabled: true,
    mode: "block",
  },
  hsts: {
    enabled: !isDev,
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  crossOriginEmbedderPolicy: {
    enabled: true,
    policy: "unsafe-none",
  },
  crossOriginOpenerPolicy: {
    enabled: true,
    policy: "same-origin-allow-popups",
  },
  crossOriginResourcePolicy: {
    enabled: true,
    policy: "same-origin",
  },
});

export default secureMiddleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
