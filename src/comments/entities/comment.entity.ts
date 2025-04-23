import { Owner } from "src/owners/entities/owner.entity";
import { Resident } from "src/residents/entities/resident.entity";
import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Check(`("ownerId" IS NOT NULL AND "residentId" IS NULL) OR ("ownerId" IS NULL AND "residentId" IS NOT NULL)`)
@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Không có tiêu đề" })
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => Owner, owner => owner.comments, { nullable: true })
    owner: Owner;

    @ManyToOne(() => Resident, resident => resident.comments, { nullable: true })
    resident: Resident;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
