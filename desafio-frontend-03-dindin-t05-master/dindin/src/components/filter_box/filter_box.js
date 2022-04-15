import './styles.css'
import CategoryBtn from '../Category_Btn/category_btn'
import { useEffect, useState } from 'react'

export default function FilterBox({
    categoryList,
    selectedCategories,
    setSelectedCategories,
    transactionArray,
    setTransactionArray,
    setResetPage,
    resetPage,
    clearClick,
    setClearClick,
    noSelection,
    setNoSelection }) {
    const [applyFilter, setApplyFilter] = useState(false)

    function handleApplyFilter() {
        if (noSelection) {
            setApplyFilter(true)
            setTimeout(() => {
                setApplyFilter(false)
            }, 100)
            return
        }
        const filteredTransactions = []

        transactionArray.filter((transaction) => {
            selectedCategories.forEach((selected) => {
                if (selected === transaction.categoria_id) {
                    return filteredTransactions.push(transaction)
                }
            })
        })

        setTransactionArray([...filteredTransactions])
        setApplyFilter(!applyFilter)
        setResetPage(!resetPage)

    }

    function handleClearFilter() {
        setClearClick(true)
        setSelectedCategories([])
        setApplyFilter(false)
        setNoSelection(true)
        setResetPage(!resetPage)

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
                            applyFilter={applyFilter}
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