import { Tentant } from "src/tentants/entities/tentant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vehicle {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    image: string;

    @ManyToOne(() => Tentant, tentant => tentant.vehicles)
    tentant: Tentant

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
