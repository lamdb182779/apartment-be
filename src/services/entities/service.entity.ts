import { Apartment } from "src/apartments/entities/apartment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column()
    area: string;

    @Column({ default: "Chờ xác nhận" })
    status: string;

    @Column({ default: false })
    isComplete: boolean;

    @Column({ nullable: true })
    reason: string;

    @ManyToOne(() => Apartment, apartment => apartment.services)
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
