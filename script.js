'use strict';

// 갤러리 슬라이드
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".gallery-track");
    const slides = [...document.querySelectorAll(".gallery-slide")];
    const dotsWrap = document.querySelector(".gallery-dots");

    const modal = document.querySelector(".gallery-modal");
    const modalImg = document.querySelector(".modal-image");
    const closeBtn = document.querySelector(".modal-close");
    const prevBtn = document.querySelector(".modal-prev");
    const nextBtn = document.querySelector(".modal-next");
    const currentNum = document.querySelector(".modal-current");
    const totalNum = document.querySelector(".modal-total");

    if (!track || !slides.length || !dotsWrap) {
        console.error("갤러리 HTML 구조를 확인필요");
        return;
    }

    if (
        !modal ||
        !modalImg ||
        !closeBtn ||
        !prevBtn ||
        !nextBtn ||
        !currentNum ||
        !totalNum
    ) {
        console.error("갤러리 모달 HTML 또는 클래스명을 확인필요");
        return;
    }

    let index = 0;
    let modalIndex = 0;

    let dragStartX = 0;
    let dragEndX = 0;
    let dragging = false;
    let wasDragged = false;

    const dotCount = Math.min(5, slides.length);
    const dots = [];

    totalNum.textContent = slides.length;

    /* 도트 생성 */
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "gallery-dot";

        dot.addEventListener("click", () => {
            const target = Number(dot.dataset.index);

            if (!Number.isNaN(target)) {
                index = target;
                updateGallery();
            }
        });

        dotsWrap.appendChild(dot);
        dots.push(dot);
    }

    /* 갤러리 위치 업데이트 */
    function updateGallery() {
        track.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
    }

    /* 도트 업데이트 */
    function updateDots() {
        const maxStart = Math.max(0, slides.length - dotCount);

        const start = Math.min(
            Math.max(index - 2, 0),
            maxStart
        );

        dots.forEach((dot, dotIndex) => {
            const realIndex = start + dotIndex;

            dot.dataset.index = realIndex;

            dot.setAttribute(
                "aria-label",
                `${realIndex + 1}번째 사진 보기`
            );

            dot.classList.remove("active", "pop");
        });

        const activeDot = dots.find(
            (dot) => Number(dot.dataset.index) === index
        );

        if (activeDot) {
            activeDot.classList.add("active");

            void activeDot.offsetWidth;

            activeDot.classList.add("pop");
        }
    }

    /* 갤러리 드래그 시작 */
    track.addEventListener("pointerdown", (event) => {
        dragging = true;
        wasDragged = false;

        dragStartX = event.clientX;
        dragEndX = event.clientX;

        track.classList.add("dragging");
    });

    /* 갤러리 드래그 중 */
    track.addEventListener("pointermove", (event) => {
        if (!dragging) return;
    
        dragEndX = event.clientX;
    
        const distance = dragEndX - dragStartX;
    
        if (Math.abs(distance) > 15) {
            wasDragged = true;
        }
    });

    /* 갤러리 드래그 종료 */
    function endDrag(event) {
        if (!dragging) return;

        dragging = false;
        track.classList.remove("dragging");

        dragEndX = event.clientX;

        const distance = dragEndX - dragStartX;

        if (wasDragged) {
            if (distance < -70 && index < slides.length - 1) {
                index++;
            } else if (distance > 70 && index > 0) {
                index--;
            }
        }

        updateGallery();
    }

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", (event) => {
        if (dragging) {
            endDrag(event);
        }
    });

    /* 모달 열기 */
    function openModal(slideIndex) {
        modalIndex = slideIndex;

        const image = slides[modalIndex].querySelector("img");

        if (!image) return;

        modalImg.src = image.src;
        modalImg.alt = image.alt || "";
        currentNum.textContent = modalIndex + 1;

        modalImg.classList.remove("fade-out");
        modalImg.classList.add("show");

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    }

    /* 이미지 클릭 */
    slides.forEach((slide, slideIndex) => {
        slide.addEventListener("click", (event) => {
            event.preventDefault();

            if (wasDragged) {
                wasDragged = false;
                return;
            }

            openModal(slideIndex);
        });
    });

    /* 모달 닫기 */
    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        modalImg.classList.remove(
            "show",
            "fade-out"
        );
    }

    closeBtn.addEventListener("click", closeModal);

    /* 모달 이미지 페이드 전환 */
    function changeModalImage() {
        modalImg.classList.remove("show");
        modalImg.classList.add("fade-out");

        window.setTimeout(() => {
            const image =
                slides[modalIndex].querySelector("img");

            if (!image) return;

            modalImg.src = image.src;
            modalImg.alt = image.alt || "";
            currentNum.textContent = modalIndex + 1;

            modalImg.classList.remove("fade-out");

            requestAnimationFrame(() => {
                modalImg.classList.add("show");
            });
        }, 180);
    }

    /* 이전 이미지 */
    prevBtn.addEventListener("click", () => {
        modalIndex =
            modalIndex === 0
                ? slides.length - 1
                : modalIndex - 1;

        changeModalImage();
    });

    /* 다음 이미지 */
    nextBtn.addEventListener("click", () => {
        modalIndex =
            modalIndex === slides.length - 1
                ? 0
                : modalIndex + 1;

        changeModalImage();
    });

    /* 모달 스와이프 */
    let modalStartX = 0;
    let modalEndX = 0;

    modalImg.addEventListener("pointerdown", (event) => {
        modalStartX = event.clientX;
        modalEndX = event.clientX;
    });

    modalImg.addEventListener("pointermove", (event) => {
        modalEndX = event.clientX;
    });

    modalImg.addEventListener("pointerup", (event) => {
        modalEndX = event.clientX;

        const distance = modalEndX - modalStartX;

        if (distance < -50) {
            nextBtn.click();
        } else if (distance > 50) {
            prevBtn.click();
        }
    });

    /* 키보드 */
    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("open")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowLeft") {
            prevBtn.click();
        }

        if (event.key === "ArrowRight") {
            nextBtn.click();
        }
    });

    updateGallery();
});


// 신랑측 / 신부측 탭
const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.tab-panel')];

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      const active = panel.id === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

// 계좌번호 복사
const toast = document.querySelector('.toast');
let toastTimer;

document.querySelectorAll('.copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
  });
});

function copyAddress() {
    const address = document.getElementById("addressText").innerText;

    navigator.clipboard.writeText(address).then(() => {
        const toast = document.getElementById("toast");

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 1200);
    });
}

const accountItems = document.querySelectorAll(".account-item");

accountItems.forEach((item) => {
    const head = item.querySelector(".account-head");

    head.addEventListener("click", () => {
        item.classList.toggle("open");
    });
});

const accountCopyButtons = document.querySelectorAll(".account-copy");
const accountToast = document.getElementById("accountToast");

accountCopyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const accountNumber = button.dataset.copy;

        try {
            await navigator.clipboard.writeText(accountNumber);

            accountToast.classList.add("show");

            setTimeout(() => {
                accountToast.classList.remove("show");
            }, 1200);
        } catch (error) {
            console.error("계좌번호 복사 실패", error);
        }
    });
});
