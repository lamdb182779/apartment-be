import { Apartment } from "src/apartments/entities/apartment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Visitor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    visitedAt: Date;

    @Column({ default: false })
    hasLeft: boolean;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Apartment, apartment => apartment.visitors)
    apartment: Apartment;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
