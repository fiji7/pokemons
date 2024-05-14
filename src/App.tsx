import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Box } from "@mui/material";
import './App.css';
import { Pokemon, PokemonDetails } from "./types/types";
import PokemonItem from './components/PokemonItem';

function isPokemonArray(data: unknown): data is Pokemon[] {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    typeof item.name === 'string' &&
    typeof item.url === 'string'
  );
};

export default function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<Record<string, PokemonDetails>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20");
        const data = response.data;
        if (isPokemonArray(data.results)) {
          setPokemons(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    getPokemons();
  }, []);

  if (error) {
    return <Box className="error-message">Something went wrong: {error}</Box>;
  }

  return (
    <div className="App">
      <Container className="main-container">
        {pokemons.map((pokemon) => (
          <PokemonItem
            key={pokemon.name}
            pokemon={pokemon}
            pokemonDetails={pokemonDetails}
            setPokemonDetails={setPokemonDetails}
            setError={setError}
          />
        ))}
      </Container>
    </div>
  );
}
