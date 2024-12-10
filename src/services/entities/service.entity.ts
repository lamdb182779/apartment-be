import { Apartment } from "src/apartments/entities/apartment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column("simple-json")
    content: any[];

    @Column({ default: false })
    isComplete: boolean;

    @ManyToOne(() => Apartment, apartment => apartment.services)
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
