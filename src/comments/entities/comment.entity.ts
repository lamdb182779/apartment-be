import { Owner } from "src/owners/entities/owner.entity";
import { Reply } from "src/replies/entities/reply.entity";
import { Resident } from "src/residents/entities/resident.entity";
import { Check, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Check(`("ownerId" IS NOT NULL AND "residentId" IS NULL) OR ("ownerId" IS NULL AND "residentId" IS NOT NULL) OR ("ownerId" IS NULL AND "residentId" IS NULL)`)
@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Không có tiêu đề" })
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Owner, owner => owner.comments, { nullable: true, onDelete: "SET NULL" })
    owner: Owner;

    @ManyToOne(() => Resident, resident => resident.comments, { nullable: true, onDelete: "SET NULL" })
    resident: Resident;

    @OneToMany(() => Reply, reply => reply.comment)
    replies: Reply[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
