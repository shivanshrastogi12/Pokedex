import React, { useState } from 'react'
import { first151Pokemon, getFullPokedexNumber } from '../utils'
const SideNav = (props) => {
  const { selectedPokemon , setSelectedPokemon,handleCloseMenu ,showSideMenu}=props
  const[searchValue,setSearchValue] = useState('')

  const filterPokemon = first151Pokemon.filter((ele,eleIndex)=>{
    if((getFullPokedexNumber(eleIndex)).includes(searchValue))
    {return true}

    if(ele.toLowerCase().includes(searchValue.toLowerCase())){return true}

    return false
  })

  return (
     
    <nav className={' '+ (!showSideMenu?'open':'')}>
      <div className={'header '+ (!showSideMenu?'open':'')}>
        <button onClick={handleCloseMenu} className='open-nav-button'>
        <i class="fa-solid fa-arrow-left"></i>
        </button>
          <h1 className='text-gradient'>Pokédex</h1>
      </div>
      <input placeholder='E.g. 001 or Bulba...' value={searchValue} onChange={(e)=>{
        setSearchValue(e.target.value)
      }} />
        {filterPokemon.map((pokemon,pokemonIndex)=>{
          const truePokedexNumber = first151Pokemon.indexOf(pokemon)
          return(
            <button onClick={()=>{setSelectedPokemon(truePokedexNumber)
              handleCloseMenu()
              }} key={pokemonIndex} className={'nav-card'+(pokemonIndex===selectedPokemon?'nav-card-selected':'')}>
              <p>{getFullPokedexNumber(truePokedexNumber)}</p>
              <p>{pokemon}</p>
            </button>
          )
        })}
    </nav>
  )
}

export default SideNav