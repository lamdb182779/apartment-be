import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column("simple-json")
    content: any[];

    @ManyToOne(() => Receptionist, receptionist => receptionist.notifications)
    receptionist: Receptionist

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
