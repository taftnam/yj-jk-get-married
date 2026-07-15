'use strict';

// 갤러리 슬라이드
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".gallery-grid");
    const items = [
        ...document.querySelectorAll(".gallery-item")
    ];

    const toggleBtn = document.querySelector(".gallery-toggle");
    const toggleText = document.querySelector(".gallery-toggle-text");

    const modal = document.querySelector(".gallery-modal");
    const modalImg = document.querySelector(".modal-image");
    const closeBtn = document.querySelector(".modal-close");
    const prevBtn = document.querySelector(".modal-prev");
    const nextBtn = document.querySelector(".modal-next");
    const currentNum = document.querySelector(".modal-current");
    const totalNum = document.querySelector(".modal-total");

    if (
        !grid ||
        !items.length ||
        !toggleBtn ||
        !modal ||
        !modalImg
    ) {
        return;
    }

    let currentIndex = 0;
    let modalStartX = 0;

    totalNum.textContent = items.length;


    /* =========================
       더보기 / 접기
    ========================= */

    toggleBtn.addEventListener("click", () => {
        const isOpen = grid.classList.toggle("open");

        toggleBtn.classList.toggle("open", isOpen);

        toggleText.textContent =
            isOpen ? "접기" : "더보기";

        if (!isOpen) {
            grid.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });
        }
    });


    /* =========================
       모달 열기
    ========================= */

    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentIndex = index;
            openModal();
        });
    });

    function openModal() {
        const image = items[currentIndex].querySelector("img");

        if (!image) return;

        modalImg.src = image.src;
        modalImg.alt = image.alt || "";

        currentNum.textContent = currentIndex + 1;

        modalImg.classList.remove("fade-out");
        modalImg.classList.add("show");

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    }


    /* =========================
       이미지 변경
    ========================= */

    function changeImage() {
        modalImg.classList.remove("show");
        modalImg.classList.add("fade-out");

        window.setTimeout(() => {
            const image =
                items[currentIndex].querySelector("img");

            if (!image) return;

            modalImg.src = image.src;
            modalImg.alt = image.alt || "";

            currentNum.textContent = currentIndex + 1;

            modalImg.classList.remove("fade-out");

            requestAnimationFrame(() => {
                modalImg.classList.add("show");
            });
        }, 160);
    }


    /* 이전 사진 */

    prevBtn.addEventListener("click", () => {
        currentIndex =
            currentIndex === 0
                ? items.length - 1
                : currentIndex - 1;

        changeImage();
    });


    /* 다음 사진 */

    nextBtn.addEventListener("click", () => {
        currentIndex =
            currentIndex === items.length - 1
                ? 0
                : currentIndex + 1;

        changeImage();
    });


    /* =========================
       모달 닫기
    ========================= */

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        modalImg.classList.remove(
            "show",
            "fade-out"
        );

        document.body.classList.remove("modal-open");
    }

    closeBtn.addEventListener("click", closeModal);


    /* 모달 바깥 클릭 시 닫기 */

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });


    /* =========================
       모바일 스와이프
    ========================= */

    modalImg.addEventListener("touchstart", (event) => {
        modalStartX =
            event.changedTouches[0].clientX;
    }, { passive:true });

    modalImg.addEventListener("touchend", (event) => {
        const modalEndX =
            event.changedTouches[0].clientX;

        const distance =
            modalEndX - modalStartX;

        if (distance < -50) {
            nextBtn.click();
        } else if (distance > 50) {
            prevBtn.click();
        }
    }, { passive:true });


    /* =========================
       키보드
    ========================= */

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("open")) {
            return;
        }

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
