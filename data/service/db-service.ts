import "reflect-metadata";
import {getConnection} from "typeorm";

import {createConnection} from "typeorm";
import { Board } from "../entity/board";
import { Lane } from "../entity/lane";
import { Card } from "../entity/card";

export class DBService {
	addCard(laneid: number, cardtext: string) {
		let connection = getConnection();

		async function addNewCard(): Promise<void> {
			try {
			    let laneRepo = connection.getRepository(Lane);
			    let cardRepo = connection.getRepository(Card);

			    let lane = await laneRepo.findOne(laneid);
			    let maxCardPos = await connection.createQueryBuilder()
			    							.select("MAX(card.position)","maxposition")
			    							.from(Card, "card")
			    							.where("card.lane = :laneid", {laneid : lane.id})
			    							.getRawOne();
			    console.log('maxCardPos' + JSON.stringify(maxCardPos));

			    if(maxCardPos == null) {
			    	maxCardPos.maxposition = 0
			    }


			    let newCard = new Card();
			    newCard.text = cardtext;
			    newCard.lane = lane;
			    newCard.position = maxCardPos.maxposition + 1;

			    await cardRepo.save(newCard);

			    console.log('added card');

			}
			catch(err) {
				console.log(err)
			}

		}

		addNewCard();
	}

	updateCard(cardid: number, cardtext:string) {
		let connection = getConnection();

		async function updateCard(): Promise<void> {
			try {
				let cardRepo = connection.getRepository(Card);

				let cardToUpdate = await cardRepo.findOne(cardid);
				cardToUpdate.text = cardtext;

				await cardRepo.save(cardToUpdate);
			}
			catch(err) {
				console.log(err);
			}
		}

		updateCard();

	}

}
