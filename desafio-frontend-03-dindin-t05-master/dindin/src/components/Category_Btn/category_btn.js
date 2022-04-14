import './styles.css'
import categoryBtnSelect from '../../assets/category_add_btn.svg'
import categoryBtnDeselect from '../../assets/category_close_btn.svg'
import { useEffect, useState } from 'react'

export default function CategoryBtn({
    category,
    selectedCategories,
    setSelectedCategories,
    noSelection,
    setNoSelection,
    clearClick
}) {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(false)
    const localSelectedCategories = [...selectedCategories]

    function handleSelectCategory(id) {
        setNoSelection(false)
        if (localSelectedCategory) {
            const categoryToRemove = localSelectedCategories.findIndex((cat) => {
                return cat === id
            })
            localSelectedCategories.splice(categoryToRemove, 1)
        } else {
            localSelectedCategories.push(id)
        }
        setSelectedCategories([...localSelectedCategories])
        setLocalSelectedCategory(!localSelectedCategory)
    }

    useEffect(() => {
        console.log('useEffect do category btn');
        if (noSelection) {
            setLocalSelectedCategory(false)
        }

        return () => {
            console.log('desmontei o category btn');
        }
    }, [clearClick])

    return (
        <div>
            <button
                key={category.id}
                className={localSelectedCategory
                    ? 'category-btn-clicked'
                    : 'category-btn'
                }
                onClick={() => handleSelectCategory(category.id)}
            >
                {category.descricao}
                <img
                    src={localSelectedCategory
                        ? categoryBtnDeselect
                        : categoryBtnSelect}
                />
            </button>
        </div >
    )
}