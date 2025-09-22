import { useEffect, useState } from "react"
import { GetBSB } from "./api/bsb";
import type { TranslationBookChapter } from "./api/models";

const App = () => {
  const [current_chapters, set_current_chapters] = useState<TranslationBookChapter[]>([]);

  useEffect(() => {
    const GetBookData = async () => {
      const data = await GetBSB<TranslationBookChapter>("/api/BSB/GEN/1.json");
      set_current_chapters([data]);
    }

    GetBookData();
  }, []);


  return (
    <div className="chapter-container">
      {current_chapters.map((c, i) => (
        <div key={i} className="chapter-block">
          <div className="title">{c.book.name}</div>
          <div className="chapterNum">Chapter {c.chapter.number}</div>
          <div className="verses">
            {c.chapter.content.map((cont, idx) => {
              if (cont.type === "heading") {
                return (
                  <h3 key={idx} className="chapter-heading">
                    {cont.content}
                  </h3>
                );
              }
              if (cont.type === "verse") {
                return (
                  <div key={idx} className="verse">
                    <span className="verse-num">{cont.number}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App