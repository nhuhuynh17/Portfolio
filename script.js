/* --- Hiển thị năm hiện tại ở footer --- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* --- Cuộn mượt đến từng phần khi nhấn navbar --- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || !document.querySelector(href)) return;

    e.preventDefault();
    // Cuộn mượt đến phần tương ứng
    document.querySelector(href).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Đóng menu trên mobile sau khi chọn
    document.body.classList.remove("nav-open");
    document.querySelector(".nav").style.display = "";
  });
});

/* --- Toggle Navbar trên mobile --- */
const mobileBtn = document.getElementById("mobileMenuBtn");
if (mobileBtn) {
  mobileBtn.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    document.body.classList.toggle("nav-open");

    if (document.body.classList.contains("nav-open")) {
      // Hiển thị menu với animation nhẹ
      nav.style.display = "flex";
      nav.style.flexDirection = "column";
      nav.style.alignItems = "center";
      nav.style.animation = "fadeIn 0.3s ease";
    } else {
      nav.style.display = "";
    }
  });
}

/* --- Animation thanh kỹ năng (Skill bars) --- */
function animateSkills() {
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    const level = bar.getAttribute("data-level") || 0;
    const fill = bar.querySelector(".skill-fill");
    // Tăng chiều rộng dần theo level
    setTimeout(() => {
      fill.style.width = Math.min(100, Math.max(0, level)) + "%";
    }, 200);
  });
}

/* --- Kích hoạt hiệu ứng kỹ năng khi cuộn đến phần đó --- */
function initSkillScroll() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;
  let done = false;

  window.addEventListener("scroll", () => {
    const rect = skillsSection.getBoundingClientRect();
    if (!done && rect.top < window.innerHeight - 120) {
      animateSkills();
      done = true;
    }
  });
}
initSkillScroll();

/* --- Tự gõ chữ cho .typing --- */
function initTyping() {
  const typingEl = document.querySelector(".typing");
  if (!typingEl) return;

  const phrases = JSON.parse(
    typingEl.getAttribute("data-phrases") || '["Hello!"]'
  );
  let phraseIndex = 0;
  let charIndex = 0;
  const typingDelay = 100;
  const erasingDelay = 50;
  const nextPhraseDelay = 1500;

  function type() {
    if (charIndex < phrases[phraseIndex].length) {
      typingEl.textContent += phrases[phraseIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, nextPhraseDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typingEl.textContent =
        phrases[phraseIndex].substring(0, charIndex - 1) || "\u00A0";
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, typingDelay);
    }
  }

  type();
}

// Khởi tạo khi DOM load xong
document.addEventListener("DOMContentLoaded", initTyping);

/* --- Xử lý form liên hệ (Demo - dùng mailto) --- */
function submitContact(ev) {
  ev.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const message = document.getElementById("message")?.value.trim();

  if (!name || !email || !message) {
    alert("🌸 Vui lòng điền đầy đủ thông tin trước khi gửi nha!");
    return;
  }

  // Tạo mail tự động
  const subject = encodeURIComponent(`Liên hệ từ portfolio của ${name}`);
  const body = encodeURIComponent(
    `Họ tên: ${name}\nEmail: ${email}\n\n${message}`
  );
  window.location.href = `mailto:nhuhuynh123gd@gmail.com?subject=${subject}&body=${body}`;

  // Reset form sau khi gửi
  document.getElementById("contactForm").reset();
}

/* --- Tô sáng mục nav tương ứng khi cuộn --- */
const sections = document.querySelectorAll("section[id]");
function updateActiveNav() {
  let index = sections.length;
  while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  const id = sections[index]?.id;
  const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
  if (activeLink) activeLink.classList.add("active");
}
window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

/* --- Nhỏ xinh: hiệu ứng mờ dần cho menu khi mở (CSS inline keyframe) --- */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

// Khi resize cửa sổ → tự reset menu về đúng trạng thái
window.addEventListener("resize", () => {
  const nav = document.querySelector(".nav");

  if (window.innerWidth > 920) {
    // 🔹 Khi về chế độ desktop: reset hoàn toàn
    document.body.classList.remove("nav-open");
    nav.removeAttribute("style"); //  Xóa toàn bộ inline CSS
  } else {
    // 🔹 Khi về chế độ mobile: ẩn menu
    if (!document.body.classList.contains("nav-open")) {
      nav.style.display = "none";
    }
  }
});

/* --- Gửi form liên hệ qua Fetch API (nâng cao, không reload trang) --- */
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Ngăn reload

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.style.display = "none"; // Ẩn form
      formMessage.style.display = "block"; // Hiện thông báo
    } else {
      const data = await response.json();
      alert("Oops! Có lỗi xảy ra: " + (data.error || "Thử lại sau"));
    }
  } catch (error) {
    alert("Oops! Có lỗi xảy ra: " + error.message);
  }
});
