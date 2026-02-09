from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader


def main() -> None:
    pdf_path = Path(r"C:\Users\Rizky\Downloads\CV Rizky Fadhillah EN.pdf")
    reader = PdfReader(str(pdf_path))

    print(f"pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        print(f"\n--- PAGE {i} ---\n")
        print(text)


if __name__ == "__main__":
    main()
