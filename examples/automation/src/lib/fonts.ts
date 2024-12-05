import localFont from "next/font/local";

const neueRegular = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
  weight: "400",
});

const neueMedium = localFont({
  src: "../fonts/NeueMontreal-Medium.woff2",
  weight: "500",
});

const neueBold = localFont({
  src: "../fonts/NeueMontreal-Bold.woff2",
  weight: "700",
});

const coandaRegular = localFont({
  src: "../fonts/Coanda-Regular.woff2",
  weight: "400",
});

export { neueBold, neueMedium, neueRegular, coandaRegular };
