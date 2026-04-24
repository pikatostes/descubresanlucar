import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CategoryMenu({
    categories = [],
    activeCategory,
    activeTag,
    onCategoryChange,
    onTagChange,
}) {
    const [openCategory, setOpenCategory] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});

    useEffect(() => {
        function handleOutside(e) {
            const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(e.target);
            const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(e.target);

            if (clickedOutsideMenu && clickedOutsideDropdown) {
                setOpenCategory(null);
            }
        }
        document.addEventListener('click', handleOutside);
        return () => document.removeEventListener('click', handleOutside);
    }, []);

    useEffect(() => {
        function updateDropdownPosition() {
            if (!openCategory) {
                setDropdownPosition(null);
                return;
            }

            const button = buttonRefs.current[openCategory];
            if (!button) {
                setDropdownPosition(null);
                return;
            }

            const rect = button.getBoundingClientRect();
            const left = Math.max(12, Math.min(rect.left, window.innerWidth - 220));

            setDropdownPosition({
                top: rect.bottom + 10,
                left,
                minWidth: Math.max(180, rect.width),
            });
        }

        updateDropdownPosition();

        window.addEventListener('resize', updateDropdownPosition);
        window.addEventListener('scroll', updateDropdownPosition, true);

        const scroller = scrollRef.current;
        if (scroller) {
            scroller.addEventListener('scroll', updateDropdownPosition);
        }

        return () => {
            window.removeEventListener('resize', updateDropdownPosition);
            window.removeEventListener('scroll', updateDropdownPosition, true);
            if (scroller) {
                scroller.removeEventListener('scroll', updateDropdownPosition);
            }
        };
    }, [openCategory]);

    const allCategories = [
        { id: 'all', slug: 'all', label: 'Todos', icon: '🏙️', tags: [] },
        ...categories.map((cat) => ({ ...cat, id: cat.slug })),
    ];

    const openCategoryData = allCategories.find((cat) => cat.slug === openCategory);

    function handleCategoryClick(slug) {
        if (slug === 'all') {
            onCategoryChange('all');
            onTagChange(null);
            setOpenCategory(null);
            return;
        }

        onCategoryChange(slug);

        const cat = allCategories.find((c) => c.slug === slug);
        const hasTags = cat?.tags?.length > 0;

        if (hasTags) {
            setOpenCategory((prev) => (prev === slug ? null : slug));
        } else {
            onTagChange(null);
            setOpenCategory(null);
        }
    }

    function handleTagClick(e, tagSlug) {
        e.stopPropagation();
        onTagChange(activeTag === tagSlug ? null : tagSlug);
        setOpenCategory(null);
    }

    function handleHorizontalWheel(e) {
        const scroller = scrollRef.current;

        if (!scroller) {
            return;
        }

        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            scroller.scrollLeft += e.deltaY;
        }
    }

    return (
        <div className="category-menu" ref={menuRef}>
            <div
                ref={scrollRef}
                onWheel={handleHorizontalWheel}
                style={{
                    overflowX: 'auto',
                    overflowY: 'visible',
                    position: 'relative',
                    zIndex: 2,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <div className="category-menu-inner">
                    {allCategories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        const isOpen = openCategory === cat.slug;
                        const hasTags = cat.tags?.length > 0;

                        return (
                            <div key={cat.id} className="category-menu__item">
                                <button
                                    ref={(el) => {
                                        if (hasTags) {
                                            buttonRefs.current[cat.slug] = el;
                                        }
                                    }}
                                    className={`category-pill ${isActive ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    aria-pressed={isActive}
                                    aria-expanded={hasTags ? isOpen : undefined}
                                >
                                    <span className="cat-icon">{cat.icon}</span>
                                    <span className="cat-label">{cat.label}</span>
                                    {hasTags && (
                                        <span
                                            className={`cat-chevron ${isOpen ? 'cat-chevron--open' : ''}`}
                                            aria-hidden="true"
                                        >
                                            ▾
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {typeof document !== 'undefined' &&
                openCategoryData?.tags?.length > 0 &&
                dropdownPosition &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="tag-dropdown"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            minWidth: dropdownPosition.minWidth,
                        }}
                    >
                        <div className="tag-dropdown__list">
                            {openCategoryData.tags.map((tag) => (
                                <button
                                    key={tag.slug}
                                    className={`tag-chip ${activeTag === tag.slug ? 'tag-chip--active' : ''}`}
                                    onClick={(e) => handleTagClick(e, tag.slug)}
                                >
                                    {tag.label}
                                    {activeTag === tag.slug && (
                                        <span className="tag-chip__remove" aria-label="Quitar filtro">×</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
