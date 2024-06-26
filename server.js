import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import vhost from "vhost";

import recortarImagensRoutes from "./src/projects/recortar-imagens/routes.js";
import preencherAtividadesRoutes from "./src/projects/preencher-atividades/routes.js";
import portfolioRoutes from "./src/projects/portfolio/routes.js";

const app = express();

// Helmet Config
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "blob:"],
      scriptSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/460/fabric.min.js",
      ],
    },
  })
);

// Rate Limit Config
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 250,
  })
);

// Ip Logging
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const route = req.originalUrl;
  console.log(`Request received from IP: ${ip}, Route: ${route}`);
  next();
});

// Project Routes and Subdomains
app.use(vhost("recortar-imagens.brunoazvd.com", recortarImagensRoutes));
app.use(vhost("preencher-atividades.brunoazvd.com", preencherAtividadesRoutes));
app.use(vhost("portfolio.brunoazvd.com", portfolioRoutes));

// Fallback Route (Redirects to Portfolio)
app.use((req, res) => {
  res.redirect("http://portfolio.brunoazvd.com:3000");
})


// Init Server
app.listen(3000, "0.0.0.0", () => {
  console.log(`Servidor Rodando`);
});
