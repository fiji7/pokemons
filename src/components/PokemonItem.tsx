import React, { useCallback, memo } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Grid, CircularProgress, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Pokemon, PokemonDetails } from "../types/types";
import axios from "axios";

interface PokemonItemProps {
    pokemon: Pokemon;
    pokemonDetails: Record<string, PokemonDetails>;
    setPokemonDetails: React.Dispatch<React.SetStateAction<Record<string, PokemonDetails>>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const PokemonItem = ({ pokemon, pokemonDetails, setPokemonDetails, setError }: PokemonItemProps) => {
    const onClick = useCallback(async (name: string, url: string) => {
        if (pokemonDetails[name]) {
            return;
        }

        try {
            const response = await axios.get(url);
            const details = response.data;
            setPokemonDetails(prevDetails => ({ ...prevDetails, [name]: details }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }, [pokemonDetails, setError, setPokemonDetails]);

    return (
        <Accordion key={pokemon.name} onClick={() => onClick(pokemon.name, pokemon.url)} className="accordion">
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {pokemon.name}
            </AccordionSummary>
            <AccordionDetails>
                {pokemonDetails[pokemon.name] ? (
                    <Grid className="pokemon-content">
                        <Box className="pokemon-content-image">
                            <img src={pokemonDetails[pokemon.name].sprites.front_default} />
                        </Box>
                        <Box className="pokemon-content-details">Height: {pokemonDetails[pokemon.name].height}</Box>
                        <Box className="pokemon-content-details">Weight: {pokemonDetails[pokemon.name].weight}</Box>
                        <Box className="pokemon-content-details">Base experience: {pokemonDetails[pokemon.name].base_experience}</Box>
                    </Grid>
                ) : (
                    <Box className="loading-placeholder"><CircularProgress /></Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default memo(PokemonItem, (prevProps, nextProps) => {
    return (
      prevProps.pokemon.name === nextProps.pokemon.name &&
      prevProps.pokemonDetails[prevProps.pokemon.name] === nextProps.pokemonDetails[nextProps.pokemon.name]
    );
  });
