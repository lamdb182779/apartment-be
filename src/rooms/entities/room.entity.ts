import { Apartment } from "src/apartments/entities/apartment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column("integer", { default: 0 })
    type: number

    @Column("decimal")
    acreage: number;

    @ManyToOne(() => Apartment, apartment => apartment.rooms)
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
