import './styles.css'
import categoryBtnSelect from '../../assets/category_add_btn.svg'
import categoryBtnDeselect from '../../assets/category_close_btn.svg'
import { useEffect, useState } from 'react'

export default function CategoryBtn({ category, selectedCategories, setSelectedCategories, noSelection, setNoSelection }) {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(false)
    const localSelectedCategories = [...selectedCategories]

    function handleSelectCategory(id) {
        setNoSelection(false)
        if (localSelectedCategory) {
            const categoryToRemove = localSelectedCategories.findIndex((cat) => {
                return cat === id
            })
            console.log(categoryToRemove);
            localSelectedCategories.splice(categoryToRemove, 1)
            console.log(localSelectedCategories);
        } else {
            localSelectedCategories.push(id)
        }
        setSelectedCategories([...localSelectedCategories])
        setLocalSelectedCategory(!localSelectedCategory)
    }

    useEffect(() => {
        if (noSelection) {
            setLocalSelectedCategory(false)
        }

        return () => {
        }
    })

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