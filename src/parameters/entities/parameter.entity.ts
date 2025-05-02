import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Parameter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    month: Date;

    @Column()
    type: string;

    @Column({ nullable: true })
    value: number;

    @ManyToOne(() => Apartment, apartment => apartment.parameters, { onDelete: "CASCADE" })
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}