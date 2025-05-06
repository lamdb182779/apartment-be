import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { NotificationRead } from 'src/notifications/entities/notification.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeUpdate, OneToMany } from 'typeorm';

@Entity()
export class Resident {
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

    @Column({ nullable: true, select: false })
    resetCode: string;

    @Column({ default: false })
    isVerify: boolean;

    @Column({ nullable: true })
    verifyId: string;

    @Column({ nullable: true })
    expiredAt: Date;

    @ManyToOne(() => Apartment, apartment => apartment.residents, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn()
    apartment: Apartment

    @OneToMany(() => Vehicle, vehicle => vehicle.resident)
    vehicles: Vehicle[]

    @OneToMany(() => NotificationRead, reads => reads.resident)
    reads: NotificationRead[]

    @OneToMany(() => Comment, comment => comment.resident)
    comments: Comment[]

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
