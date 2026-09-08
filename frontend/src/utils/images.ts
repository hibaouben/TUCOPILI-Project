const imageModules = import.meta.glob("../assets/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

const imageMap: Record<string, string> = {};

for (const path in imageModules) {
  const filename = path.split("/").pop() as string;
  imageMap[filename] = imageModules[path] as string;
}

export function getProductImage(filename: string | null | undefined): string | null {
  if (!filename) return null;

  const image = imageMap[filename];

  if (!image) {
    console.warn(`Image introuvable dans assets/ : "${filename}"`);
    return null;
  }

  return image;
}