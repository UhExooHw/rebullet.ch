export async function includePartials(root = document) {
  const slots = Array.from(root.querySelectorAll("[data-include]"));

  await Promise.all(
    slots.map(async (slot) => {
      const filePath = slot.getAttribute("data-include");
      if (!filePath) return;

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load partial: ${filePath}`);
      }

      slot.innerHTML = await response.text();
      slot.removeAttribute("data-include");
    })
  );
}
