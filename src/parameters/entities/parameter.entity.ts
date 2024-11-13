import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Parameter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    month: Date;

    @Column()
    type: string;

    @Column()
    value: number;

    @ManyToOne(() => Apartment, apartment => apartment.parameters)
    apartment: Apartment
}