import React, { useState } from 'react'
import { useEffect } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'

const PokeCard = (props) => {
  const { selectedPokemon } = props
  const [data, setdata] = useState(null)
  const [loading, setloading] = useState(false)
  const [skill, setskill] = useState(null)
  const [loadingSkill, setloadingSkill] = useState(false)

  const { name, height, abilities, stats, types, moves, sprites } = data || {}

  const imgList = Object.keys(sprites || {}).filter(val => {
    if (!sprites[val]) { return false }
    if (['versions', 'other'].includes(val)) { return false }
    return true
  })

  async function fetchMoveData(move, moveurl) {
    if (loadingSkill || !localStorage || !moveurl) { return }

    let c = {}
    if (localStorage.getItem('pokemon-moves')) {
      c = JSON.parse(localStorage.getItem('pokemon-moves'))
    }
    if (move in c) {
      setskill(c[move])
      console.log('Found move in cache')
      return
    }
    try {
      setloadingSkill(true)
      const res = await fetch(moveurl)
      const moveData = await res.json()
      console.log(moveData)
      const description = moveData?.flavor_text_entries.filter
        (val => {
          return val.version_group.name = 'firered-leafgreen'
        })[0]?.flavor_text

      const skillData = {
        name: move,
        description
      }
      setskill(skillData)
      c[move] = skillData
      localStorage.setItem('pokemon-moves', JSON.stringify(c))
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setloadingSkill(false)
    }
  }



  useEffect(() => {
    if (loading || !localStorage) { return }

    let cache = {}
    if (localStorage.getItem('pokedex')) {
      cache = JSON.parse(localStorage.getItem('pokedex'))
    }


    if (selectedPokemon in cache) {
      setdata(cache[selectedPokemon])
      console.log('Found pokemin in cache')
      return
    }

    async function fetchPokemonData() {
      setloading(true)
      try {
        const baseurl = 'https://pokeapi.co/api/v2/'
        const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
        const finalurl = baseurl + suffix
        const res = await fetch(finalurl)
        const pokemondata = await res.json()
        setdata(pokemondata)
        console.log('Fetched pokemon data')
        cache[selectedPokemon] = pokemondata
        localStorage.setItem('pokedex', JSON.stringify(cache))
      }
      catch (err) {
        console.log(err.message)
      }
      finally {
        setloading(false)
      }
    }

    fetchPokemonData()


  }, [selectedPokemon])

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    )
  }
  return (
    <div className='poke-card'>
      {skill && (<Modal handleCloseModal={() => { setskill(null) }} >
        <div>
          <h6>Name</h6>
          <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
        </div>
        <div>
          <h6>Description</h6>
          <p>{skill.description}</p>
        </div>

      </Modal>)}
      <div>
        <h4>{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className='type-container'>
        {types.map((typeObj, typeIndex) => {
          return (
            <TypeCard key={typeIndex} type={typeObj?.type?.name} />
          )
        })}
      </div>
      <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`} />
      <div className='img-container'>
        {imgList.map((spriteurl, sprtiteIndex) => {
          const imgurl = sprites[spriteurl]
          return (
            <img key={sprtiteIndex} src={imgurl} alt={`${name}-img-${spriteurl}`} />
          )
        })}
      </div>
      <h3>Stats</h3>
      <div className='stats-card'>
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj
          return (
            <div key={statIndex} className='stat-item'>
              <p>{stat?.name.replaceAll('-', ' ')}</p>
              <h4>{base_stat}</h4>
            </div>
          )
        })}
      </div>
      <h3>Moves</h3>
      <div className='pokemon-move-grid'>
        {moves.map((moveObj, moveIndex) => {
          return (
            <button className='button-card-pokemon-move' key={moveIndex} onClick={() => { fetchMoveData(moveObj?.move?.name, moveObj?.move?.url) }}>
              <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
            </button>
          )
        })}
      </div>

    </div>
  )
}

export default PokeCard