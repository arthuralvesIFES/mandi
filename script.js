const months = [
  {
    period: "14/08/26 — 13/09/26",
    name: "1º mês",
    letter: "Amanda,\n\ncomeçar essa história com você deixou tudo mais bonito. Que seja só o primeiro de muitos capítulos nossos.",
    letterImage: "1 mes/carta.png",
    photos: [
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (1).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (2).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (3).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.14.jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.15 (1).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.15 (2).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.15 (3).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.15 (4).jpeg" },
      { src: "1 mes/WhatsApp Image 2026-09-12 at 09.30.15.jpeg" },
    ],
  },
  {
    period: "14/09/26 — 13/10/26",
    name: "2º mês",
    letter: "",
    photos: [
      { src: "2 mes/1.jpeg" },
      { src: "2 mes/2.jpeg" },
    ],
  },
];

const monthGrid = document.querySelector("#month-grid");
const monthTemplate = document.querySelector("#month-template");
const photoTemplate = document.querySelector("#photo-template");
const dialog = document.querySelector("#memory-dialog");
const lightbox = document.querySelector("#photo-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const letterButton = document.querySelector("#letter-button");
const letterImage = document.querySelector("#letter-image");
const conveyorTrack = document.querySelector("#conveyor-track");
const conveyorPhotos = [
  "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (1).jpeg",
  "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (2).jpeg",
  "1 mes/WhatsApp Image 2026-09-12 at 09.30.14 (3).jpeg",
  "1 mes/WhatsApp Image 2026-09-12 at 09.30.14.jpeg",
  "1 mes/WhatsApp Image 2026-09-12 at 09.30.15 (1).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.37.jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.38 (1).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.38 (2).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.38 (3).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.38 (4).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.38.jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.39 (1).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.39 (2).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.39 (3).jpeg",
  "geral/WhatsApp Image 2026-09-12 at 11.24.39.jpeg",
];

if (months.length === 1) monthGrid.classList.add("single-month");

function createConveyorSet(hidden = false) {
  const set = document.createElement("div");
  set.className = "conveyor-set";
  if (hidden) set.setAttribute("aria-hidden", "true");

  conveyorPhotos.forEach((src) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    image.loading = "lazy";
    set.append(image);
  });

  return set;
}

conveyorTrack.append(createConveyorSet(), createConveyorSet(true));

function syncPageScroll() {
  document.body.classList.toggle("is-modal-open", dialog.open || lightbox.open);
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.showModal();
  syncPageScroll();
}

function openMemory(month) {
  document.querySelector("#dialog-title").textContent = month.name;
  const letter = document.querySelector(".letter");
  const letterText = document.querySelector("#letter-text");
  const signature = letter.querySelector(".letter-signature");
  const hasLetterImage = Boolean(month.letterImage);
  letter.classList.toggle("letter-with-image", hasLetterImage);
  letterButton.hidden = !hasLetterImage;
  letterText.hidden = hasLetterImage;
  signature.hidden = hasLetterImage || !month.letter;
  if (hasLetterImage) {
    letterImage.src = month.letterImage;
  } else {
    letterImage.removeAttribute("src");
    letterText.textContent = month.letter;
  }
  const photoStrip = document.querySelector("#photo-strip");
  photoStrip.replaceChildren();

  month.photos.forEach(({ src, caption = "" }) => {
    const photo = photoTemplate.content.cloneNode(true);
    const image = photo.querySelector(".photo-image");
    image.src = src;
    image.alt = caption || "Arthur e Amanda";
    const button = photo.querySelector(".photo-button");
    button.setAttribute("aria-label", `Ampliar foto ${photoStrip.children.length + 1}`);
    button.addEventListener("click", () => openLightbox(src, image.alt));
    photo.querySelector("figcaption").textContent = caption;
    photoStrip.append(photo);
  });

  dialog.showModal();
  syncPageScroll();
}

letterButton.addEventListener("click", () => {
  if (letterImage.src) openLightbox(letterImage.src, letterImage.alt);
});

months.forEach((month) => {
  const card = monthTemplate.content.cloneNode(true);
  card.querySelector(".month-number").textContent = month.period;
  card.querySelector(".month-name").textContent = month.name;
  if (month.photos.length) {
    card.querySelector(".month-card").classList.add("has-photo-preview");
    card.querySelectorAll(".folder-preview-photo").forEach((preview, index) => {
      const image = month.photos[index];
      if (image) preview.style.backgroundImage = `url("${image.src}")`;
    });
  }
  card.querySelector(".folder").addEventListener("click", () => openMemory(month));
  monthGrid.append(card);
});

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", syncPageScroll);

document.querySelector("#close-lightbox").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  syncPageScroll();
});
