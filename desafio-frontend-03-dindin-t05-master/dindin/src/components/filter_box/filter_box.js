import './styles.css'
import CategoryBtn from '../Category_Btn/category_btn'
import { useEffect, useState } from 'react'

export default function FilterBox({ categoryList }) {
    const [applyFilter, setApplyFilter] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [noSelection, setNoSelection] = useState(true)
    const [clearClick, setClearClick] = useState(false)

    function handleApplyFilter() {
        setApplyFilter(!applyFilter)
        console.log(applyFilter);
    }

    function handleClearFilter() {
        setClearClick(true)
        setSelectedCategories([])
        setApplyFilter(false)
        setNoSelection(true)

        setTimeout(() => {
            setClearClick(false)
        }, 100)
    }

    useEffect(() => {

        return () => {
        }
    }, [noSelection])

    return (
        <div className='filter-box'>
            <h4>Categoria</h4>
            <div>
                <div className='category-list-box'>
                    {categoryList.map((category) => (
                        <CategoryBtn
                            key={category.id}
                            category={category}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            handleClearFilter={handleClearFilter}
                            noSelection={noSelection}
                            setNoSelection={setNoSelection}
                            clearClick={clearClick}
                        />
                    ))}
                </div>
                <div className='empty-div'></div>
            </div>
            <div className='filter-btns'>
                <button
                    className={clearClick
                        ? 'limpar-filtro-clicked'
                        : 'limpar-filtro-btn'
                    }
                    onClick={() => handleClearFilter()}
                >
                    Limpar Filtros
                </button>
                <button
                    onClick={() => handleApplyFilter()}
                    className={applyFilter
                        ? 'aplicar-filtro-clicked'
                        : 'aplicar-filtro-btn'
                    }
                >
                    Aplicar Filtros</button>
            </div>
        </div>
    )
}