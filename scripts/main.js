import { includePartials } from "./modules/include.js";
import { initI18n } from "./modules/i18n.js";

async function bootstrap() {
  await includePartials();
  await initI18n("en");
}

bootstrap().catch((error) => {
  console.error(error);
});
