import { Owner } from "src/owners/entities/owner.entity";
import { Resident } from "src/residents/entities/resident.entity";
import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Check(`("ownerId" IS NOT NULL AND "residentId" IS NULL) OR ("ownerId" IS NULL AND "residentId" IS NOT NULL)`)
@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    image: string;

    @ManyToOne(() => Resident, resident => resident.vehicles, { onDelete: "CASCADE" })
    resident: Resident

    @ManyToOne(() => Owner, owner => owner.vehicles, { onDelete: "CASCADE" })
    owner: Owner

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
