import { Icon } from "@iconify/react";
import { useAppProvider } from "../providers/app_provider";
import "./ChapterSettings.scss";

interface ToggleItemProps {
    heading: string;
    caption: string;
    active: boolean;
    setActive: (value: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
    heading,
    caption,
    active,
    setActive,
}) => {
    return (
        <div className="item">
            <div className="label">
                <div className="label-heading">{heading}</div>
                <div className="caption">{caption}</div>
            </div>
            <div
                className={`toggle ${active ? "active" : ""}`}
                onClick={() => setActive(!active)}
            >
                <div className="ball" />
            </div>
        </div>
    );
};

const ChapterSettings = () => {
    const { chapterContentViewSettings, setChapterContentViewSettings, chapterNavSettings, setChapterNavSettings } = useAppProvider();

    return (
        <div id="DOC_EL_CHAPTER_SETTINGS" className='chapter-settings'>
            <div className="exit">
                <Icon icon="basil:cross-solid" width="36" height="36" onClick={() => {
                    document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
                }} />
            </div>
            <div className="heading">Settings</div>
            <div className="section">
                <div className="subheading">Navigation</div>
                <ToggleItem heading="Show Bookmark" caption="Bookmark chapters to enable easy revisiting"
                    active={chapterNavSettings.showBookmark}
                    setActive={(val) => {
                        setChapterNavSettings({ ...chapterNavSettings, showBookmark: val });
                    }}/>
                <ToggleItem heading="Show History" caption="Display history of last visited chapters"
                    active={chapterNavSettings.showHistory}
                    setActive={(val) => {
                        setChapterNavSettings({ ...chapterNavSettings, showHistory: val });
                    }}/>
            </div>
            <div className="section">
                <div className="subheading">View</div>
                <ToggleItem heading="Manuscript Mode" caption="Remove chapter subheadings and verse numbers"
                    active={chapterContentViewSettings.manusriptMode}
                    setActive={(val) => {
                        setChapterContentViewSettings({ ...chapterContentViewSettings, manusriptMode: val });
                    }}/>
            </div>
        </div>
    )
}

export default ChapterSettings