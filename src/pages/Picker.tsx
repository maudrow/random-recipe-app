// todo(mishmishmish) Update the look of this page

import * as React from 'react'

import { useSearchParams, Link } from 'react-router-dom'
import { getRecipes, getAllIngredients, getRecipesWithIngredients } from '../db/index'
import type { CourseAll } from '../db/index'
import Layout from '../components/Layout'

function Picker () {

  const validCourses: CourseAll[] = ['main', 'appetizer', 'dessert', 'all']

  const [searchParams, setSearchParams] = useSearchParams()
  const searchIngredients = searchParams.get('ingredients')
  const searchCourse = searchParams.get('course')

  const [pickedIngredients, setPickedIngredients] = React.useState<string[]>([])
  const [pickedCourse, setPickedCourse] = React.useState<CourseAll>(validCourses[0])
  const [searchText, setSearchText] = React.useState<string>('')
  const [filteredIngredients, setFilteredIngredients] = React.useState<string[]>(getAllIngredients(getRecipes(pickedCourse)))
  const [isEnableAddButton, setIsEnableAddButton] = React.useState<Boolean>()

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formIngredient = formData.get('ingredient') as string
    if (filteredIngredients.length === 1) {
      setPickedIngredients([...pickedIngredients, filteredIngredients[0]])
    } else if (
      !formIngredient ||
      pickedIngredients.includes(formIngredient) ||
      !filteredIngredients.includes(formIngredient)
    ) {
      return
    } else {
      setPickedIngredients([...pickedIngredients, formIngredient])
    }
    setSearchText('')
  }

  function onClickIngredient (ingredient: string) {
    setPickedIngredients([...pickedIngredients, ingredient])
  }

  function handleRemove (ingredient: string) {
    setPickedIngredients(pickedIngredients.filter(i => i !== ingredient))
  }

  React.useEffect(() => {
    if (searchIngredients) {
      setPickedIngredients(searchIngredients.split('-'))
    }
  }, [searchIngredients])

  React.useEffect(() => {
    if (searchCourse && validCourses.includes(searchCourse as CourseAll)) {
      setPickedCourse(searchCourse as CourseAll)
    }
  }, [searchCourse])

  React.useEffect(() => {
    setPickedIngredients([])
  }, [pickedCourse])

  React.useEffect(() => {
    if (pickedIngredients.length > 0) {
      setSearchParams({ course: pickedCourse, ingredients: pickedIngredients.join('-') }, { replace: true })
    } else {
      setSearchParams({course: pickedCourse}, { replace: true })
    }
    const remainingRecipes = getRecipesWithIngredients(pickedIngredients, getRecipes(pickedCourse))
    setFilteredIngredients(getAllIngredients(remainingRecipes))
  }, [pickedIngredients])

  React.useEffect(() => {
    const remainingRecipes = getRecipesWithIngredients(pickedIngredients, getRecipes(pickedCourse))
    const ingredients = getAllIngredients(remainingRecipes)
    setFilteredIngredients(ingredients.filter(ingredient => {
      if (pickedIngredients.includes(ingredient)) {
        return false
      } else if (!searchText) {
        return true
      } else {
        return ingredient.toLowerCase().startsWith(searchText.toLowerCase())
      }
    }))
    setIsEnableAddButton(
      (filteredIngredients.length === 1) ||
      filteredIngredients.map(i => i.toLowerCase()).includes(searchText.toLowerCase())
    )
    console.log()
  }, [searchText, pickedIngredients])

  return (
    <Layout>
      <h2>Picked items</h2>
      <ul>
        {pickedIngredients.sort().map((ingredient, index) => (
          <li key={index}>
            {ingredient}
            {' '}
            <button onClick={() => handleRemove(ingredient)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2>Pick here</h2>
      <form onSubmit={handleSubmit}>
        {validCourses.map(course => (
          <input key={course} type='button' name='course' value={course}
          style={
            pickedCourse === course ? {backgroundColor: '#ff0000'} : {}
          }
          onClick={() => setPickedCourse(course)}
          />
        ))}
        <br/>
        <br/>
        <input
          value={searchText}
          onChange={event => setSearchText(event.target.value)}
          type='text'
          placeholder='lemon'
          name='ingredient'
        />
        <button disabled={!isEnableAddButton} type='submit'>Add</button>
        <br/>
        <br/>
        {filteredIngredients.map(ingredient => (
          <button
            onClick={() => onClickIngredient(ingredient)}
            key={ingredient}>
            {ingredient}
          </button>
        ))}
        {filteredIngredients.length === 0 && <p>No results</p>}
      </form>
      <br/>
      <Link to={{ pathname: '/random', search: searchParams.toString() }}>
        <button disabled={pickedIngredients.length < 1}>Wrangle Some Recipes!</button>
      </Link>
    </Layout>
  )
}

export default Picker