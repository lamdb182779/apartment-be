import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeUpdate, OneToMany } from 'typeorm';

@Entity()
export class Tentant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: 32, update: false })
    role: number;

    @Column({ nullable: true })
    image: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, unique: true })
    phone: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ default: false })
    isVerify: boolean;

    @Column({ nullable: true })
    verifyId: string;

    @Column({ nullable: true })
    expiredAt: Date;

    @ManyToOne(() => Apartment, apartment => apartment.tentants, { nullable: true })
    @JoinColumn()
    apartment: Apartment

    @OneToMany(() => Vehicle, vehicle => vehicle.tentant, { onDelete: "CASCADE" })
    vehicles: Vehicle[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeUpdate()
    async checkActiveStatus() {
        if (this.active === false) {
            this.apartment = null
        }
    }
}
