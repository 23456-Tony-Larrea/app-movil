import type { B2CConfiguration } from "./b2cClient";

export const b2cConfig: B2CConfiguration = {
  auth: {
    clientId: "5c86ff09-e78c-49ab-9c6d-504c0b364c70",
    authorityBase:
      "https://lifejuntoati.b2clogin.com/tfp/lifejuntoati.onmicrosoft.com",
    policies: {
      signInSignUp: "B2C_1_singInSingUpAppBuprex",
      // passwordReset: "B2C_1_PasswordReset",
    },
    redirectUri:
      "msauth://com.life.entregaslife/JTsxJFEjbB%2B9YfT2oXt5mBkzpVI%3D",
  },
  // web only:
  cache: { cacheLocation: "localStorage" },
};

export const b2cScopes = [
  "https://lifejuntoati.onmicrosoft.com/appentregas/Read",
];
