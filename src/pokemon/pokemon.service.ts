import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { Error, Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';



@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }


  //////////////////  Servicio Crear Pokemon /////////////////
  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon
      // 'This action adds a new pokemon';
    } catch (error) {
      console.log(error)
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exist in DB ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error)
      throw new InternalServerErrorException(`Can't create Pokemon in DB check server logs`)
    }
  }

  async findAll() {
    return `This action returns all pokemon`;
    // const allPoke = await this.pokemonModel.
    // console.log(allPoke)
    // return allPoke
  }

  //////////////////  Servicio Busca pokemon por id/name/number /////////////////
  async findOne(term: string) {

    let pokemon: Pokemon;

    // Search for no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    // Search for idMongo
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    // Search for name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }
    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" no found`);

    return pokemon;
  }

  //////////////////  Servicio Actulizar  /////////////////
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    // let nameMinu = updatePokemonDto.name
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handlerExceptions(error)
    }
  }

  async remove(id: string) {

    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { acknowledged, deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id:${id} not found`);

    return `Pokemon with id:${id} deleted:${acknowledged}`;

  }


  private handlerExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`the change is found assigning another pokemon ${JSON.stringify(error.keyValue)}`)
    }
  };

}
